import type { AppData, Skill } from './types';

export const SKILLS: Skill[] = ['woorden', 'grammatica', 'lezen', 'luisteren', 'schrijven', 'spreken', 'knm'];

export function emptyData(): AppData {
  return {
    version: 1,
    lessons: {},
    checkpoints: [],
    srs: {},
    marked: {},
    flash: {},
    days: {},
    xp: 0,
    streak: { count: 0, best: 0, freezes: 1 },
    skills: Object.fromEntries(SKILLS.map((s) => [s, [0, 0]])) as AppData['skills'],
    results: [],
    badges: [],
    seen: [],
    settings: { theme: 'system', style: 'claude', rate: 0.95, weekendMinutes: 90, model: 'claude-haiku-5-5', sound: true },
  };
}
