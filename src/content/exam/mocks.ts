/** A shortened A2 mock exam. Part A: Lezen, Luisteren, KNM. Part B: Schrijven, Spreken. */
export interface MockExam {
  n: number;
  reading: string[];
  listening: string[];
  /** Number of KNM questions drawn across all themes. */
  knm: number;
  writing: string[];
  speaking: string[];
}

export const MOCKS: MockExam[] = [
  {
    n: 1,
    reading: ['m-bibliotheek', 'm-zwembad', 'r3-huisarts', 'r4-gemeente-afval'],
    listening: ['m-l-apotheek', 'm-l-trein', 'l3-huisarts', 'l5-gemeente'],
    knm: 15,
    writing: ['m-w-form', 'm-w-bericht'],
    speaking: ['m-s-1', 'm-s-3', 's5-ziek', 's6-leven'],
  },
  {
    n: 2,
    reading: ['m-werkrooster', 'm-apotheek', 'r5-vacature', 'r6-stempas'],
    listening: ['m-l-buren', 'm-l-werk', 'l4-politie', 'l6-afval'],
    knm: 15,
    writing: ['m-w-mail', 'w4-feest'],
    speaking: ['m-s-2', 'm-s-4', 's4-buren', 's5-gezond'],
  },
  {
    n: 3,
    reading: ['m-huurbaas', 'm-cursus', 'r2-ns', 'r6-verhuizen'],
    listening: ['m-l-afspraak', 'm-l-markt', 'l2-bus', 'l6-stemmen'],
    knm: 15,
    writing: ['m-w-uitnodiging', 'w5-ziekmelding'],
    speaking: ['m-s-5', 'm-s-6', 's2-weg', 's6-klimaat'],
  },
];
