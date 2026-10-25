/** Verb forms for drills: [infinitive, english, ik, jij/hij, wij, perfect (aux + participle), imperfect sg, imperfect pl, lesson] */
export interface Verb {
  inf: string;
  en: string;
  ik: string;
  hij: string;
  wij: string;
  aux: 'hebben' | 'zijn';
  pp: string;
  past: string;
  pastPl: string;
  lesson: number;
}

type Row = [string, string, string, string, 'h' | 'z', string, string, string, number];

const ROWS: Row[] = [
  ['wonen', 'to live', 'woon', 'woont', 'h', 'gewoond', 'woonde', 'woonden', 1],
  ['komen', 'to come', 'kom', 'komt', 'z', 'gekomen', 'kwam', 'kwamen', 1],
  ['heten', 'to be called', 'heet', 'heet', 'h', 'geheten', 'heette', 'heetten', 1],
  ['zijn', 'to be', 'ben', 'is', 'z', 'geweest', 'was', 'waren', 1],
  ['hebben', 'to have', 'heb', 'heeft', 'h', 'gehad', 'had', 'hadden', 2],
  ['werken', 'to work', 'werk', 'werkt', 'h', 'gewerkt', 'werkte', 'werkten', 3],
  ['gaan', 'to go', 'ga', 'gaat', 'z', 'gegaan', 'ging', 'gingen', 3],
  ['doen', 'to do', 'doe', 'doet', 'h', 'gedaan', 'deed', 'deden', 3],
  ['leren', 'to learn', 'leer', 'leert', 'h', 'geleerd', 'leerde', 'leerden', 3],
  ['spreken', 'to speak', 'spreek', 'spreekt', 'h', 'gesproken', 'sprak', 'spraken', 4],
  ['willen', 'to want', 'wil', 'wil', 'h', 'gewild', 'wilde', 'wilden', 4],
  ['beginnen', 'to begin', 'begin', 'begint', 'z', 'begonnen', 'begon', 'begonnen', 4],
  ['luisteren', 'to listen', 'luister', 'luistert', 'h', 'geluisterd', 'luisterde', 'luisterden', 4],
  ['eten', 'to eat', 'eet', 'eet', 'h', 'gegeten', 'at', 'aten', 5],
  ['drinken', 'to drink', 'drink', 'drinkt', 'h', 'gedronken', 'dronk', 'dronken', 5],
  ['moeten', 'to have to', 'moet', 'moet', 'h', 'gemoeten', 'moest', 'moesten', 5],
  ['lezen', 'to read', 'lees', 'leest', 'h', 'gelezen', 'las', 'lazen', 5],
  ['kijken', 'to look, watch', 'kijk', 'kijkt', 'h', 'gekeken', 'keek', 'keken', 5],
  ['missen', 'to miss', 'mis', 'mist', 'h', 'gemist', 'miste', 'misten', 5],
  ['vertrekken', 'to leave', 'vertrek', 'vertrekt', 'z', 'vertrokken', 'vertrok', 'vertrokken', 5],
  ['kopen', 'to buy', 'koop', 'koopt', 'h', 'gekocht', 'kocht', 'kochten', 6],
  ['betalen', 'to pay', 'betaal', 'betaalt', 'h', 'betaald', 'betaalde', 'betaalden', 6],
  ['kunnen', 'can', 'kan', 'kan', 'h', 'gekund', 'kon', 'konden', 6],
  ['mogen', 'may', 'mag', 'mag', 'h', 'gemogen', 'mocht', 'mochten', 6],
  ['vinden', 'to find', 'vind', 'vindt', 'h', 'gevonden', 'vond', 'vonden', 6],
  ['zoeken', 'to look for', 'zoek', 'zoekt', 'h', 'gezocht', 'zocht', 'zochten', 6],
  ['weten', 'to know', 'weet', 'weet', 'h', 'geweten', 'wist', 'wisten', 6],
  ['zien', 'to see', 'zie', 'ziet', 'h', 'gezien', 'zag', 'zagen', 6],
  ['helpen', 'to help', 'help', 'helpt', 'h', 'geholpen', 'hielp', 'hielpen', 6],
  ['begrijpen', 'to understand', 'begrijp', 'begrijpt', 'h', 'begrepen', 'begreep', 'begrepen', 7],
  ['schrijven', 'to write', 'schrijf', 'schrijft', 'h', 'geschreven', 'schreef', 'schreven', 7],
  ['krijgen', 'to get', 'krijg', 'krijgt', 'h', 'gekregen', 'kreeg', 'kregen', 7],
  ['kennen', 'to know (someone)', 'ken', 'kent', 'h', 'gekend', 'kende', 'kenden', 7],
  ['praten', 'to talk', 'praat', 'praat', 'h', 'gepraat', 'praatte', 'praatten', 7],
  ['oefenen', 'to practise', 'oefen', 'oefent', 'h', 'geoefend', 'oefende', 'oefenden', 7],
  ['nemen', 'to take', 'neem', 'neemt', 'h', 'genomen', 'nam', 'namen', 8],
  ['denken', 'to think', 'denk', 'denkt', 'h', 'gedacht', 'dacht', 'dachten', 8],
  ['koken', 'to cook', 'kook', 'kookt', 'h', 'gekookt', 'kookte', 'kookten', 8],
  ['fietsen', 'to cycle', 'fiets', 'fietst', 'h', 'gefietst', 'fietste', 'fietsten', 9],
  ['wachten', 'to wait', 'wacht', 'wacht', 'h', 'gewacht', 'wachtte', 'wachtten', 9],
  ['zitten', 'to sit', 'zit', 'zit', 'h', 'gezeten', 'zat', 'zaten', 9],
  ['lopen', 'to walk', 'loop', 'loopt', 'z', 'gelopen', 'liep', 'liepen', 9],
  ['regenen', 'to rain', 'regen', 'regent', 'h', 'geregend', 'regende', 'regenden', 9],
  ['worden', 'to become', 'word', 'wordt', 'z', 'geworden', 'werd', 'werden', 10],
  ['huren', 'to rent', 'huur', 'huurt', 'h', 'gehuurd', 'huurde', 'huurden', 11],
  ['slapen', 'to sleep', 'slaap', 'slaapt', 'h', 'geslapen', 'sliep', 'sliepen', 11],
  ['vragen', 'to ask', 'vraag', 'vraagt', 'h', 'gevraagd', 'vroeg', 'vroegen', 12],
  ['zeggen', 'to say', 'zeg', 'zegt', 'h', 'gezegd', 'zei', 'zeiden', 12],
  ['bellen', 'to call', 'bel', 'belt', 'h', 'gebeld', 'belde', 'belden', 13],
  ['maken', 'to make', 'maak', 'maakt', 'h', 'gemaakt', 'maakte', 'maakten', 13],
  ['sturen', 'to send', 'stuur', 'stuurt', 'h', 'gestuurd', 'stuurde', 'stuurden', 13],
  ['spelen', 'to play', 'speel', 'speelt', 'h', 'gespeeld', 'speelde', 'speelden', 14],
  ['brengen', 'to bring', 'breng', 'brengt', 'h', 'gebracht', 'bracht', 'brachten', 15],
  ['liggen', 'to lie', 'lig', 'ligt', 'h', 'gelegen', 'lag', 'lagen', 15],
  ['staan', 'to stand', 'sta', 'staat', 'h', 'gestaan', 'stond', 'stonden', 15],
  ['kiezen', 'to choose', 'kies', 'kiest', 'h', 'gekozen', 'koos', 'kozen', 16],
  ['blijven', 'to stay', 'blijf', 'blijft', 'z', 'gebleven', 'bleef', 'bleven', 17],
  ['verdienen', 'to earn', 'verdien', 'verdient', 'h', 'verdiend', 'verdiende', 'verdienden', 17],
  ['geven', 'to give', 'geef', 'geeft', 'h', 'gegeven', 'gaf', 'gaven', 19],
  ['reizen', 'to travel', 'reis', 'reist', 'h', 'gereisd', 'reisde', 'reisden', 20],
  ['vliegen', 'to fly', 'vlieg', 'vliegt', 'h', 'gevlogen', 'vloog', 'vlogen', 20],
  ['rijden', 'to drive, ride', 'rijd', 'rijdt', 'h', 'gereden', 'reed', 'reden', 20],
  ['trouwen', 'to marry', 'trouw', 'trouwt', 'z', 'getrouwd', 'trouwde', 'trouwden', 24],
  ['stelen', 'to steal', 'steel', 'steelt', 'h', 'gestolen', 'stal', 'stalen', 26],
  ['sterven', 'to die', 'sterf', 'sterft', 'z', 'gestorven', 'stierf', 'stierven', 31],
  ['verliezen', 'to lose', 'verlies', 'verliest', 'h', 'verloren', 'verloor', 'verloren', 34],
  ['winnen', 'to win', 'win', 'wint', 'h', 'gewonnen', 'won', 'wonnen', 34],
];

export const VERBS: Verb[] = ROWS.map(([inf, en, ik, hij, a, pp, past, pastPl, lesson]) => ({
  inf,
  en,
  ik,
  hij,
  wij: inf,
  aux: a === 'h' ? 'hebben' : 'zijn',
  pp,
  past,
  pastPl,
  lesson,
}));

export const SUBJECTS = [
  { s: 'ik', form: 'ik', aux: { hebben: 'heb', zijn: 'ben' } },
  { s: 'jij', form: 'hij', aux: { hebben: 'hebt', zijn: 'bent' } },
  { s: 'hij', form: 'hij', aux: { hebben: 'heeft', zijn: 'is' } },
  { s: 'zij', form: 'hij', aux: { hebben: 'heeft', zijn: 'is' } },
  { s: 'wij', form: 'wij', aux: { hebben: 'hebben', zijn: 'zijn' } },
  { s: 'jullie', form: 'wij', aux: { hebben: 'hebben', zijn: 'zijn' } },
] as const;

/** Present tense form for a subject. Handles zijn/hebben specials. */
export function presentForm(v: Verb, subject: (typeof SUBJECTS)[number]['s']): string {
  if (v.inf === 'zijn') return { ik: 'ben', jij: 'bent', hij: 'is', zij: 'is', wij: 'zijn', jullie: 'zijn' }[subject];
  if (v.inf === 'hebben') return { ik: 'heb', jij: 'hebt', hij: 'heeft', zij: 'heeft', wij: 'hebben', jullie: 'hebben' }[subject];
  if (v.inf === 'kunnen' && subject === 'jij') return 'kunt';
  if (v.inf === 'willen' && subject === 'jij') return 'wilt';
  const row = SUBJECTS.find((x) => x.s === subject)!;
  return row.form === 'ik' ? v.ik : row.form === 'hij' ? v.hij : v.wij;
}

/* ---------- Numbers, prices and times in words ---------- */

const UNITS_NL = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
const TENS_NL = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];

/** 0–9999 in Dutch words: 47 → zevenenveertig, 22 → tweeëntwintig. */
export function numberToDutch(n: number): string {
  if (n < 20) return UNITS_NL[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (!u) return TENS_NL[t];
    const unit = UNITS_NL[u];
    const joiner = unit.endsWith('e') ? 'ën' : 'en';
    return `${unit}${joiner}${TENS_NL[t]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return `${h === 1 ? '' : UNITS_NL[h]}honderd${r ? numberToDutch(r) : ''}`;
  }
  const th = Math.floor(n / 1000);
  const r = n % 1000;
  return `${th === 1 ? '' : numberToDutch(th)}duizend${r ? (r < 100 ? '' : '') + numberToDutch(r) : ''}`;
}

const HOURS = ['twaalf', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf'];

/** Time (minutes in steps of 5) as Dutch clock words: 8:25 → vijf voor half negen. */
export function timeToDutch(h: number, m: number): string {
  const hr = (x: number) => HOURS[x % 12 === 0 ? 12 : x % 12];
  const next = hr(h + 1);
  switch (m) {
    case 0:
      return `${hr(h)} uur`;
    case 5:
    case 10:
      return `${numberToDutch(m)} over ${hr(h)}`;
    case 15:
      return `kwart over ${hr(h)}`;
    case 20:
    case 25:
      return `${numberToDutch(30 - m)} voor half ${next}`;
    case 30:
      return `half ${next}`;
    case 35:
    case 40:
      return `${numberToDutch(m - 30)} over half ${next}`;
    case 45:
      return `kwart voor ${next}`;
    default:
      return `${numberToDutch(60 - m)} voor ${next}`;
  }
}
