import { mc } from '../dsl';
import type { KnmTheme } from '../schema';

export const knmA: KnmTheme[] = [
  {
    id: 'wonen',
    title: 'Wonen',
    titleEn: 'Housing',
    lessons: [11, 15, 37],
    intro: 'Renting, neighbours, waste and registering your address.',
    facts: [],
    questions: [mc('Je verhuist. Waar moet je je nieuwe adres doorgeven?', 'Bij de gemeente', 'Bij de politie', 'Bij de huisarts')],
  },
];
