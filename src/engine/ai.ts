/* Lazy entry point for the AI tutor: the Anthropic SDK is only downloaded when a feature uses it. */
import type * as Impl from './aiImpl';

export type { SpeakingFeedback, TutorFeedback, TutorReply, TutorTurn, WritingFeedback } from './aiImpl';

export const AI_MODELS = [
  { id: 'claude-haiku-5-5', label: 'Haiku 5.5 — fast and very cheap' },
  { id: 'claude-sonnet-5-5', label: 'Sonnet 5.5 — better feedback' },
  { id: 'claude-opus-5-5', label: 'Opus 5.5 — best quality' },
];

const load = () => import('./aiImpl');

export const tutorTurn = (...a: Parameters<typeof Impl.tutorTurn>) => load().then((m) => m.tutorTurn(...a));
export const tutorFeedback = (...a: Parameters<typeof Impl.tutorFeedback>) => load().then((m) => m.tutorFeedback(...a));
export const gradeWriting = (...a: Parameters<typeof Impl.gradeWriting>) => load().then((m) => m.gradeWriting(...a));
export const gradeSpeaking = (...a: Parameters<typeof Impl.gradeSpeaking>) => load().then((m) => m.gradeSpeaking(...a));
