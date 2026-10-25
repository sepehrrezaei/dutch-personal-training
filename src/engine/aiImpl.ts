import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';

/* Optional AI tutor (loaded on demand through ./ai). The learner's own key is used straight from the browser and never leaves their device
   except in requests to the Anthropic API. */

function client(apiKey: string) {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
}

export class AiError extends Error {}

function explain(err: unknown): AiError {
  if (err instanceof Anthropic.AuthenticationError) return new AiError('The API key was rejected. Check it in Settings.');
  if (err instanceof Anthropic.PermissionDeniedError) return new AiError('This API key may not use that model.');
  if (err instanceof Anthropic.RateLimitError) return new AiError('Too many requests right now — try again in a minute.');
  if (err instanceof Anthropic.APIConnectionError) return new AiError('No connection to the AI service. Are you offline?');
  if (err instanceof Anthropic.APIError) return new AiError(`AI service error (${err.status}): ${err.message}`);
  if (err instanceof AiError) return err;
  return new AiError(err instanceof Error ? err.message : 'Unknown AI error');
}

const LEVEL_RULES = `The learner is an adult beginner preparing for the Dutch Inburgeringsexamen at level A2.
Use only short, simple Dutch sentences (A1–A2): present tense, perfect tense, common modal verbs, everyday words.
Never use difficult idioms. Be warm and encouraging.`;

async function structured<T>(
  apiKey: string,
  model: string,
  schema: z.ZodType<T>,
  system: string,
  messages: Anthropic.MessageParam[],
  effort: 'low' | 'medium' = 'low',
): Promise<T> {
  try {
    const res = await client(apiKey).messages.parse({
      model,
      max_tokens: 4000,
      system,
      messages,
      output_config: { format: zodOutputFormat(schema), effort },
    });
    if (res.stop_reason === 'refusal') throw new AiError('The AI declined this request. Try rephrasing.');
    if (!res.parsed_output) throw new AiError('The AI answer could not be read. Please try again.');
    return res.parsed_output as T;
  } catch (e) {
    throw explain(e);
  }
}

/* ---------- Role-play conversation ---------- */

export interface TutorTurn {
  role: 'user' | 'assistant';
  text: string;
}

const TurnSchema = z.object({
  reply: z.string().describe('Your next line in the role-play, in simple Dutch (max 2 short sentences).'),
  en: z.string().describe('English translation of reply.'),
  correction: z
    .string()
    .nullable()
    .describe("If the learner's last message had a mistake: the corrected Dutch sentence. Otherwise null."),
  why: z.string().nullable().describe('One short English explanation of the correction, or null.'),
  done: z.boolean().describe('True when the conversation goal has been reached or after about 8 exchanges.'),
});
export type TutorReply = z.infer<typeof TurnSchema>;

export function tutorTurn(apiKey: string, model: string, scenario: { role: string; goal: string; opener: string }, history: TutorTurn[]) {
  const system = `${LEVEL_RULES}
You play this role in a role-play: ${scenario.role}
Goal of the conversation for the learner: ${scenario.goal}
Stay in character. Ask one question at a time so the learner must answer in Dutch.
If the learner writes English, gently answer in Dutch and encourage them to try in Dutch.`;
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: `(Start the role-play. Your first line was: "${scenario.opener}")` },
    { role: 'assistant', content: JSON.stringify({ reply: scenario.opener, en: '', correction: null, why: null, done: false }) },
    ...history.slice(1).map((t) => ({
      role: t.role,
      content: t.role === 'assistant' ? JSON.stringify({ reply: t.text }) : t.text,
    })),
  ];
  return structured(apiKey, model, TurnSchema, system, messages);
}

const FeedbackSchema = z.object({
  score: z.number().describe('0–10: how well the learner communicated at A2 level.'),
  summary: z.string().describe('Two encouraging sentences in English.'),
  strengths: z.array(z.string()).describe('Up to 3 things done well (English).'),
  fixes: z
    .array(z.object({ wrong: z.string(), right: z.string(), why: z.string() }))
    .describe('Up to 5 most useful corrections of learner sentences.'),
  newWords: z.array(z.object({ nl: z.string(), en: z.string() })).describe('Up to 5 useful words for this situation.'),
});
export type TutorFeedback = z.infer<typeof FeedbackSchema>;

export function tutorFeedback(apiKey: string, model: string, scenario: { role: string; goal: string }, history: TutorTurn[]) {
  const transcript = history.map((t) => `${t.role === 'user' ? 'LEARNER' : 'PARTNER'}: ${t.text}`).join('\n');
  return structured(
    apiKey,
    model,
    FeedbackSchema,
    `${LEVEL_RULES}\nYou are now the learner's teacher. Give feedback in English on their Dutch.`,
    [{ role: 'user', content: `Role-play: ${scenario.role}. Goal: ${scenario.goal}\n\nTranscript:\n${transcript}` }],
    'medium',
  );
}

/* ---------- Writing (Schrijven) ---------- */

const WritingSchema = z.object({
  score: z.number().describe('0–10 against the A2 Schrijven criteria: task done, understandable, enough grammar/spelling.'),
  passLikely: z.boolean(),
  covered: z.array(z.boolean()).describe('For each required point, in order: was it covered?'),
  corrections: z.array(z.object({ original: z.string(), corrected: z.string(), explanation: z.string() })),
  improved: z.string().describe("The learner's text rewritten correctly at A2 level, keeping their ideas."),
  comment: z.string().describe('Two or three sentences of feedback in English.'),
});
export type WritingFeedback = z.infer<typeof WritingSchema>;

export function gradeWriting(apiKey: string, model: string, task: { situation: string; mustInclude: string[] }, answer: string) {
  return structured(
    apiKey,
    model,
    WritingSchema,
    `${LEVEL_RULES}\nYou are an examiner for the A2 Schrijven exam. Be fair: at A2 small mistakes are fine if the message is clear.`,
    [
      {
        role: 'user',
        content: `Task: ${task.situation}\nRequired points:\n${task.mustInclude.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nLearner's text:\n${answer}`,
      },
    ],
    'medium',
  );
}

/* ---------- Speaking (Spreken) ---------- */

const SpeakingSchema = z.object({
  score: z.number().describe('0–10: does the answer fit the question, is it understandable, is it long enough for A2?'),
  comment: z.string().describe('Two sentences of feedback in English.'),
  better: z.string().describe('A good A2 answer in Dutch, close to what the learner tried to say.'),
});
export type SpeakingFeedback = z.infer<typeof SpeakingSchema>;

export function gradeSpeaking(apiKey: string, model: string, prompt: string, transcript: string) {
  return structured(
    apiKey,
    model,
    SpeakingSchema,
    `${LEVEL_RULES}\nYou are an examiner for the A2 Spreken exam. The answer is a speech-recognition transcript, so ignore punctuation and small recognition errors.`,
    [{ role: 'user', content: `Question: ${prompt}\nLearner's spoken answer (transcript): ${transcript}` }],
  );
}
