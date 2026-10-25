import type { GrammarTopic } from '../schema';

export const grammar4: GrammarTopic[] = [
  {
    id: 'alles-iedereen',
    title: 'Alle, alles, iedereen, allemaal',
    titleEn: 'All, everything, everybody',
    lesson: 22,
    summary: 'alle + plural noun (all the …); alles = everything (things); iedereen = everybody (people, singular verb); allemaal = all of us/them (after the verb).',
    points: [
      {
        text: 'iedereen takes a singular verb.',
        examples: [
          ['Iedereen mag zelf kiezen.', 'Everybody may choose for themselves.'],
          ['Iedereen is welkom.', 'Everybody is welcome.'],
        ],
      },
      {
        text: 'allemaal comes after the verb and refers back to a plural.',
        examples: [
          ['We komen allemaal uit een ander land.', 'We all come from a different country.'],
          ['De kinderen zijn allemaal vrij.', 'The children are all free.'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: '___ mensen hebben dezelfde rechten.', options: ['Alle', 'Alles', 'Iedereen'], answer: 0 },
      { type: 'mc', prompt: 'Ik heb ___ gegeten.', options: ['alles', 'alle', 'iedereen'], answer: 0 },
      { type: 'mc', prompt: '___ is welkom op het feest.', options: ['Iedereen', 'Alle', 'Allemaal'], answer: 0 },
      { type: 'mc', prompt: 'Wij gaan ___ mee.', options: ['allemaal', 'alle', 'iedereen'], answer: 0 },
      { type: 'mc', prompt: 'Iedereen ___ Nederlands.', options: ['leert', 'leren'], answer: 0 },
      { type: 'fill', prompt: '___ winkels zijn dicht op Eerste Kerstdag. (all)', answer: 'Alle' },
      { type: 'fill', prompt: 'Is ___ goed met je? (everything)', answer: 'alles' },
      { type: 'fill', prompt: 'De studenten zijn ___ ziek. (all of them)', answer: 'allemaal' },
      { type: 'order', words: ['Iedereen', 'mag', 'zelf', 'kiezen'], en: 'Everybody may choose for themselves.' },
    ],
  },
  {
    id: 'conjunctions',
    title: 'En, maar, want, dus, of',
    titleEn: 'Coordinating conjunctions',
    lesson: 23,
    summary: 'en (and), maar (but), want (because), dus (so), of (or) join two main clauses. The word order after them does NOT change. Compare: want + normal order, omdat + verb at the end.',
    points: [
      {
        text: 'After en, maar, want, of: subject + verb as usual. After dus you may also invert (dus leer ik / dus ik leer).',
        examples: [
          ['Ik werk hier, dus ik leer veel. / dus leer ik veel.', 'I work here, so I learn a lot.'],
          ['Ik ben moe, want ik heb slecht geslapen.', "I'm tired, because I slept badly."],
          ['Wil je koffie of wil je thee?', 'Do you want coffee or tea?'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Ik wil komen, ___ ik heb geen tijd.', options: ['maar', 'want', 'dus'], answer: 0 },
      { type: 'mc', prompt: 'Ik blijf thuis, ___ ik ben ziek.', options: ['want', 'maar', 'of'], answer: 0 },
      { type: 'mc', prompt: 'Het regent, ___ ik neem de bus.', options: ['dus', 'want', 'of'], answer: 0 },
      { type: 'mc', prompt: 'Ga je mee ___ blijf je thuis?', options: ['of', 'en', 'dus'], answer: 0 },
      { type: 'mc', prompt: 'Ik blijf thuis, want ik ___.', options: ['ben ziek', 'ziek ben'], answer: 0 },
      { type: 'mc', prompt: 'Ik blijf thuis, omdat ik ___.', options: ['ziek ben', 'ben ziek'], answer: 0 },
      { type: 'transform', prompt: 'Ik ben moe. Ik ga slapen.', instruction: 'Join with "dus"', answer: ['Ik ben moe, dus ik ga slapen.', 'Ik ben moe, dus ga ik slapen.'] },
      { type: 'transform', prompt: 'Ik eet geen vlees. Ik ben vegetarisch.', instruction: 'Join with "want"', answer: 'Ik eet geen vlees, want ik ben vegetarisch.' },
      { type: 'order', words: ['Ik', 'maak', 'fouten,', 'maar', 'dat', 'is', 'niet', 'erg'], en: "I make mistakes, but that's not bad." },
    ],
  },
  {
    id: 'zou',
    title: 'Zou(den) en dezelfde/hetzelfde',
    titleEn: 'Would; the same',
    lesson: 24,
    summary: 'zou/zouden + infinitive = would. Use it for wishes, polite questions and unreal situations. "Dezelfde" with de-words and plurals, "hetzelfde" with het-words or alone.',
    points: [
      {
        text: 'Wishes and politeness: Ik zou graag … willen. Zou u … kunnen?',
        examples: [
          ['Ik zou ooit willen trouwen.', 'I would like to get married one day.'],
          ['Zou u mij kunnen helpen?', 'Could you help me?'],
          ['Als ik rijk was, zou ik reizen.', 'If I were rich, I would travel.'],
        ],
      },
      {
        text: 'dezelfde / hetzelfde',
        examples: [
          ['We hebben dezelfde rechten. (de rechten)', 'We have the same rights.'],
          ['Hij woont in hetzelfde huis. (het huis)', 'He lives in the same house.'],
          ['Dat is niet hetzelfde.', "That's not the same."],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik ___ graag een huis kopen. (would)', answer: 'zou' },
      { type: 'fill', prompt: '___ u het raam dicht kunnen doen? (would)', answer: 'Zou' },
      { type: 'fill', prompt: 'Wij ___ liever in de stad wonen. (would)', answer: 'zouden' },
      { type: 'mc', prompt: 'We wonen in ___ straat.', options: ['dezelfde', 'hetzelfde'], answer: 0 },
      { type: 'mc', prompt: 'Ze hebben ___ huis.', options: ['hetzelfde', 'dezelfde'], answer: 0 },
      { type: 'mc', prompt: 'Samenwonen en trouwen is niet ___.', options: ['hetzelfde', 'dezelfde'], answer: 0 },
      { type: 'transform', prompt: 'Kunt u mij helpen?', instruction: 'Make it more polite with "zou"', answer: 'Zou u mij kunnen helpen?' },
      { type: 'order', words: ['Ik', 'zou', 'graag', 'naar', 'Japan', 'gaan'], en: 'I would love to go to Japan.' },
    ],
  },
  {
    id: 'superlative',
    title: 'De overtreffende trap',
    titleEn: 'Superlatives',
    lesson: 25,
    summary: 'Before a noun: de/het + adjective + -ste (de hoogste toren). Alone, after a verb: het + adjective + -st (Deze toren is het hoogst).',
    table: {
      head: ['adjective', 'before a noun', 'after a verb'],
      rows: [
        ['hoog', 'het hoogste punt', 'is het hoogst'],
        ['laag', 'het laagste punt', 'is het laagst'],
        ['groot', 'de grootste stad', 'is het grootst'],
        ['goed', 'de beste les', 'is het best'],
        ['veel', 'de meeste mensen', 'het meest'],
        ['mooi', 'de mooiste reis', 'is het mooist'],
      ],
    },
    points: [
      {
        text: '"een van de …ste" = one of the …est.',
        examples: [['een van de grootste waterwerken van de wereld', 'one of the biggest water works in the world']],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Rotterdam heeft de ___ haven van Europa. (groot)', answer: 'grootste' },
      { type: 'fill', prompt: 'Het ___ punt is 322 meter. (hoog)', answer: 'hoogste' },
      { type: 'fill', prompt: 'Welk seizoen vind je het ___? (mooi)', answer: 'mooist' },
      { type: 'fill', prompt: 'De ___ mensen wonen in de Randstad. (veel)', answer: 'meeste' },
      { type: 'fill', prompt: 'Dit is de ___ pizza van de stad. (goed)', answer: 'beste' },
      { type: 'mc', prompt: 'Utrecht Centraal is het ___ station.', options: ['drukste', 'drukst', 'drukker'], answer: 0 },
      { type: 'mc', prompt: 'Welke stad is het ___?', options: ['grootst', 'grootste', 'groter'], answer: 0 },
      { type: 'order', words: ['Dat', 'was', 'het', 'mooiste', 'moment'], en: 'That was the most beautiful moment.' },
    ],
  },
  {
    id: 'perfect-separable',
    title: 'Perfectum van scheidbare werkwoorden',
    titleEn: 'Perfect tense of separable verbs',
    lesson: 26,
    summary: 'With separable verbs, ge- goes between the prefix and the verb, written as one word: inbreken → ingebroken, opbellen → opgebeld. Verbs with be-, ver-, ont-, her-, ge- get no ge-.',
    table: {
      head: ['infinitive', 'participle'],
      rows: [
        ['inbreken', 'ingebroken'],
        ['opruimen', 'opgeruimd'],
        ['aankomen', 'aangekomen'],
        ['meenemen', 'meegenomen'],
        ['thuiskomen', 'thuisgekomen'],
        ['vertellen', 'verteld (no ge-)'],
        ['bekijken', 'bekeken (no ge-)'],
      ],
    },
    points: [
      {
        text: 'Fixed combinations like "aangifte doen" behave the same way: the participle goes to the end.',
        examples: [
          ['We hebben aangifte gedaan.', 'We filed a report.'],
          ['Er is bij ons ingebroken.', 'Our house was broken into.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Er is bij ons ___. (inbreken)', answer: 'ingebroken' },
      { type: 'fill', prompt: 'Hoe laat ben je ___? (thuiskomen)', answer: 'thuisgekomen' },
      { type: 'fill', prompt: 'De trein is om negen uur ___. (aankomen)', answer: 'aangekomen' },
      { type: 'fill', prompt: 'Heb je je paspoort ___? (meenemen)', answer: 'meegenomen' },
      { type: 'fill', prompt: 'De agent heeft alles ___. (bekijken)', answer: 'bekeken' },
      { type: 'fill', prompt: 'Ze heeft een verhaal ___. (vertellen)', answer: 'verteld' },
      { type: 'transform', prompt: 'Ik doe aangifte.', instruction: 'Put in the perfect tense', answer: 'Ik heb aangifte gedaan.' },
      { type: 'transform', prompt: 'Ik ruim de kamer op.', instruction: 'Put in the perfect tense', answer: 'Ik heb de kamer opgeruimd.' },
      { type: 'order', words: ['We', 'hebben', 'de', 'politie', 'opgebeld'], en: 'We called the police.' },
    ],
  },
  {
    id: 'ordinals',
    title: 'Rangtelwoorden en datums',
    titleEn: 'Ordinal numbers and dates',
    lesson: 27,
    summary: 'Ordinals: number + -de (2–19, except 1, 3, 8) or + -ste (1, 8, 20 and up). eerste, tweede, derde, vierde, vijfde, achtste, twintigste. Dates: op 4 mei (vier mei) or op de vierde mei.',
    table: {
      head: ['number', 'ordinal'],
      rows: [
        ['1', 'eerste'],
        ['2', 'tweede'],
        ['3', 'derde'],
        ['4', 'vierde'],
        ['5', 'vijfde'],
        ['8', 'achtste'],
        ['10', 'tiende'],
        ['20', 'twintigste'],
        ['21', 'eenentwintigste'],
        ['100', 'honderdste'],
      ],
    },
    points: [
      {
        text: 'Years: 1945 = negentienvijfenveertig; 2026 = tweeduizend zesentwintig.',
        examples: [
          ['de Tweede Wereldoorlog', 'the Second World War'],
          ['Ik woon op de derde verdieping.', 'I live on the third floor.'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: '1e', options: ['eerste', 'eende', 'eenste'], answer: 0 },
      { type: 'mc', prompt: '3e', options: ['derde', 'drieste', 'driede'], answer: 0 },
      { type: 'mc', prompt: '8e', options: ['achtste', 'achtde', 'achte'], answer: 0 },
      { type: 'mc', prompt: '20e', options: ['twintigste', 'twintigde', 'twintigen'], answer: 0 },
      { type: 'fill', prompt: '5 december = de ___ december', answer: 'vijfde' },
      { type: 'fill', prompt: 'Ik woon op de ___ verdieping. (2)', answer: 'tweede' },
      { type: 'fill', prompt: 'Het is de ___ keer. (4)', answer: 'vierde' },
      { type: 'mc', prompt: 'Koningsdag is op ___ april.', options: ['zevenentwintig', 'zevenentwintigste', 'tweeënzeventig'], answer: 0 },
    ],
  },
  {
    id: 'relative',
    title: 'Betrekkelijke bijzinnen: die en dat',
    titleEn: 'Relative clauses',
    lesson: 28,
    summary: 'Use "die" for de-words and plurals, "dat" for het-words. The verb goes to the end of the relative clause. For places use "waar".',
    points: [
      {
        text: 'die / dat',
        examples: [
          ['De man die daar staat, is mijn buurman.', 'The man who is standing there is my neighbour.'],
          ['Het huis dat ik huur, is klein.', 'The house that I rent is small.'],
          ['Mensen die met de auto gaan, staan in de file.', 'People who go by car are in traffic jams.'],
        ],
      },
      {
        text: 'waar = where (places)',
        examples: [['Den Haag is de stad waar de regering werkt.', 'The Hague is the city where the government works.']],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'De stad ___ ik woon, is mooi.', options: ['waar', 'die', 'dat'], answer: 0 },
      { type: 'mc', prompt: 'Het boek ___ ik lees, is spannend.', options: ['dat', 'die'], answer: 0 },
      { type: 'mc', prompt: 'De vrouw ___ naast mij woont, heet Petra.', options: ['die', 'dat'], answer: 0 },
      { type: 'mc', prompt: 'De kinderen ___ buiten spelen, zijn blij.', options: ['die', 'dat'], answer: 0 },
      { type: 'mc', prompt: 'Het meisje ___ daar zit, is mijn dochter.', options: ['dat', 'die'], answer: 0, explain: 'het meisje → dat' },
      { type: 'order', words: ['Het', 'huis', 'dat', 'ik', 'huur,', 'is', 'klein'], en: 'The house that I rent is small.' },
      { type: 'transform', prompt: 'Ik heb een fiets. De fiets is nieuw.', instruction: 'Join with "die": De fiets die …', answer: 'De fiets die ik heb, is nieuw.' },
      { type: 'transform', prompt: 'Ik ken een man. Hij spreekt vijf talen.', instruction: 'Join: Ik ken een man die …', answer: 'Ik ken een man die vijf talen spreekt.' },
    ],
  },
];
