export type Verdict = 'correct' | 'typo' | 'accent' | 'article' | 'wrong';

export interface CheckResult {
  verdict: Verdict;
  /** True when the answer should be counted as right (typos and accents are forgiven). */
  ok: boolean;
  expected: string;
  note?: string;
}

const ARTICLES = new Set(['de', 'het', 'een']);

/** Lowercase, unify quotes, drop sentence punctuation and extra spaces. Keeps diacritics. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”„"]/g, '')
    .replace(/[.,!?;:()¿¡…]/g, ' ')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

function typoAllowance(len: number): number {
  if (len >= 12) return 2;
  if (len >= 5) return 1;
  return 0;
}

function checkOne(given: string, expected: string): CheckResult {
  const g = normalize(given);
  const e = normalize(expected);
  if (g === e) return { verdict: 'correct', ok: true, expected };
  if (stripAccents(g) === stripAccents(e)) {
    return { verdict: 'accent', ok: true, expected, note: `Watch the accents: ${expected}` };
  }
  const gw = g.split(' ');
  const ew = e.split(' ');
  if (ARTICLES.has(ew[0]) && ew.length > 1) {
    const eRest = ew.slice(1).join(' ');
    const gHasArticle = ARTICLES.has(gw[0]);
    const gRest = gHasArticle ? gw.slice(1).join(' ') : g;
    if (stripAccents(gRest) === stripAccents(eRest) || levenshtein(gRest, eRest) <= typoAllowance(eRest.length)) {
      return {
        verdict: 'article',
        ok: false,
        expected,
        note: gHasArticle ? `It's "${ew[0]} ${eRest}".` : `Don't forget the article: ${ew[0]} ${eRest}.`,
      };
    }
  }
  const d = levenshtein(stripAccents(g), stripAccents(e));
  if (d <= typoAllowance(e.length)) {
    return { verdict: 'typo', ok: true, expected, note: `Small typo — it's spelled "${expected}".` };
  }
  return { verdict: 'wrong', ok: false, expected };
}

const RANK: Record<Verdict, number> = { correct: 4, accent: 3, typo: 2, article: 1, wrong: 0 };

/** Compare an answer against one or more accepted answers and return the most forgiving verdict. */
export function check(given: string, accepted: string | string[]): CheckResult {
  const list = Array.isArray(accepted) ? accepted : [accepted];
  let best = checkOne(given, list[0]);
  for (const a of list.slice(1)) {
    const r = checkOne(given, a);
    if (RANK[r.verdict] > RANK[best.verdict]) best = r;
  }
  if (!given.trim()) return { verdict: 'wrong', ok: false, expected: list[0] };
  return best;
}

/** Word-level similarity (0..1) between a spoken transcript and the target sentence. */
export function speechScore(transcript: string, target: string): { score: number; missed: string[] } {
  const t = stripAccents(normalize(transcript)).split(' ').filter(Boolean);
  const e = stripAccents(normalize(target)).split(' ').filter(Boolean);
  if (!e.length) return { score: 0, missed: [] };
  // Longest common subsequence over words, with fuzzy word equality.
  const same = (a: string, b: string) => a === b || levenshtein(a, b) <= (b.length >= 6 ? 1 : 0);
  const dp: number[][] = Array.from({ length: e.length + 1 }, () => Array(t.length + 1).fill(0));
  for (let i = 1; i <= e.length; i++)
    for (let j = 1; j <= t.length; j++)
      dp[i][j] = same(t[j - 1], e[i - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const missed: string[] = [];
  let i = e.length;
  let j = t.length;
  const matched = new Set<number>();
  while (i > 0 && j > 0) {
    if (same(t[j - 1], e[i - 1])) {
      matched.add(i - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  const origWords = normalize(target).split(' ').filter(Boolean);
  e.forEach((_, k) => {
    if (!matched.has(k)) missed.push(origWords[k] ?? e[k]);
  });
  return { score: dp[e.length][t.length] / e.length, missed };
}

/** Split a Dutch sentence into word tokens, keeping punctuation attached to separate tokens. */
export function tokenize(s: string): string[] {
  return s.match(/[\p{L}\p{N}'’-]+|[^\s\p{L}\p{N}]/gu) ?? [];
}
