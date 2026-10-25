import type { GrammarTopic } from '../schema';

export const grammar5: GrammarTopic[] = [
  {
    id: 'fixed-prepositions',
    title: 'Werkwoorden met een vast voorzetsel',
    titleEn: 'Verbs with a fixed preposition',
    lesson: 29,
    summary: 'Many verbs always go with the same preposition. Learn them as one unit: houden van, genieten van, wachten op, denken aan, praten over, besteden aan, interesse hebben in.',
    table: {
      head: ['verb + preposition', 'meaning'],
      rows: [
        ['houden van', 'to love, like'],
        ['genieten van', 'to enjoy'],
        ['wachten op', 'to wait for'],
        ['denken aan', 'to think of'],
        ['praten over', 'to talk about'],
        ['besteden aan', 'to spend on'],
        ['zorgen voor', 'to take care of'],
        ['bang zijn voor', 'to be afraid of'],
        ['interesse hebben in', 'to be interested in'],
        ['meedoen aan', 'to take part in'],
      ],
    },
    points: [
      {
        text: 'The preposition usually comes after the object, often at the end of the question: Waar wacht je op?',
        examples: [
          ['Ik wacht op de bus.', 'I am waiting for the bus.'],
          ['Waar denk je aan?', 'What are you thinking of?'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik hou ___ voetbal.', answer: 'van' },
      { type: 'fill', prompt: 'We wachten ___ de trein.', answer: 'op' },
      { type: 'fill', prompt: 'Ik denk vaak ___ mijn familie.', answer: 'aan' },
      { type: 'fill', prompt: 'Ze praten ___ het weer.', answer: 'over' },
      { type: 'fill', prompt: 'Hij geniet ___ de zon.', answer: 'van' },
      { type: 'fill', prompt: 'Ik besteed veel tijd ___ sport.', answer: 'aan' },
      { type: 'fill', prompt: 'Wie zorgt ___ de kinderen?', answer: 'voor' },
      { type: 'fill', prompt: 'Ik heb interesse ___ kunst.', answer: 'in' },
      { type: 'mc', prompt: 'Mei is bang ___ hoogte.', options: ['voor', 'van', 'op'], answer: 0 },
      { type: 'order', words: ['Waar', 'wacht', 'je', 'op?'], en: 'What are you waiting for?' },
    ],
  },
  {
    id: 'passive',
    title: 'De lijdende vorm (tegenwoordige tijd)',
    titleEn: 'The passive (present)',
    lesson: 30,
    summary: 'Passive = worden + past participle. Use it when the action matters more than who does it. Add "door" to say who does it.',
    table: {
      head: ['active', 'passive'],
      rows: [
        ['De bakker bakt het brood.', 'Het brood wordt gebakken (door de bakker).'],
        ['Ze zoeken personeel.', 'Er wordt personeel gezocht.'],
        ['Men erkent mijn diploma niet.', 'Mijn diploma wordt niet erkend.'],
      ],
    },
    points: [
      {
        text: 'Singular subject: wordt; plural subject: worden.',
        examples: [
          ['De brief wordt vandaag verstuurd.', 'The letter is sent today.'],
          ['De huizen worden gebouwd.', 'The houses are being built.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Het brood ___ elke ochtend gebakken.', answer: 'wordt' },
      { type: 'fill', prompt: 'De huizen ___ gebouwd.', answer: 'worden' },
      { type: 'fill', prompt: 'Er wordt personeel ___. (zoeken)', answer: 'gezocht' },
      { type: 'fill', prompt: 'Mijn diploma wordt niet ___. (erkennen)', answer: 'erkend' },
      { type: 'fill', prompt: 'De post wordt om tien uur ___. (brengen)', answer: 'gebracht' },
      { type: 'transform', prompt: 'De docent controleert het huiswerk.', instruction: 'Make it passive', answer: ['Het huiswerk wordt gecontroleerd door de docent.', 'Het huiswerk wordt door de docent gecontroleerd.'] },
      { type: 'transform', prompt: 'Ze verkopen hier fietsen.', instruction: 'Make it passive (Hier worden …)', answer: 'Hier worden fietsen verkocht.' },
      { type: 'mc', prompt: 'In Nederland ___ veel kaas gegeten.', options: ['wordt', 'worden', 'is'], answer: 0 },
    ],
  },
  {
    id: 'om-te',
    title: 'Om … te + infinitief',
    titleEn: 'om … te (in order to)',
    lesson: 31,
    summary: '"Om … te + infinitive" explains a purpose: why you do something. The object and other words come between om and te.',
    points: [
      {
        text: 'Structure: om + (object / extra words) + te + infinitive.',
        examples: [
          ['Ik ren om fit te blijven.', 'I run to stay fit.'],
          ['Om gezond te blijven, moet je bewegen.', 'To stay healthy, you must exercise.'],
          ['Ik ga naar de winkel om brood te kopen.', 'I go to the shop to buy bread.'],
        ],
      },
      {
        text: 'Also after adjectives and nouns: Het is belangrijk om … te …; Ik heb geen tijd om … te …',
        examples: [['Het is belangrijk om genoeg te slapen.', 'It is important to sleep enough.']],
      },
    ],
    exercises: [
      { type: 'order', words: ['Ik', 'fiets', 'om', 'gezond', 'te', 'blijven'], en: 'I cycle to stay healthy.' },
      { type: 'order', words: ['Ik', 'ga', 'naar', 'de', 'markt', 'om', 'fruit', 'te', 'kopen'], en: 'I go to the market to buy fruit.' },
      { type: 'order', words: ['Het', 'is', 'belangrijk', 'om', 'genoeg', 'te', 'slapen'], en: 'It is important to sleep enough.' },
      { type: 'fill', prompt: 'Ik leer Nederlands ___ hier te werken.', answer: 'om' },
      { type: 'fill', prompt: 'Ik heb geen tijd om te ___. (sporten)', answer: 'sporten' },
      { type: 'fill', prompt: 'Om fit te ___, ren ik elke dag. (blijven)', answer: 'blijven' },
      { type: 'transform', prompt: 'Ik ga naar de huisarts. Ik wil een recept halen.', instruction: 'Join with om … te', answer: 'Ik ga naar de huisarts om een recept te halen.' },
      { type: 'transform', prompt: 'Ik doe yoga. Ik wil ontspannen.', instruction: 'Join with om … te', answer: 'Ik doe yoga om te ontspannen.' },
    ],
  },
  {
    id: 'time-clauses',
    title: 'Tijd: als, wanneer, toen, voordat, nadat, terwijl',
    titleEn: 'Time clauses',
    lesson: 32,
    summary: 'These conjunctions start a subordinate clause (verb at the end). Toen = when, one time in the past. Als/wanneer = when (present/future/repeated). Voordat = before, nadat = after, terwijl = while.',
    points: [
      {
        text: 'toen vs. als',
        examples: [
          ['Toen ik in Utrecht woonde, fietste ik veel.', 'When I lived in Utrecht, I cycled a lot.'],
          ['Als het regent, neem ik de bus.', 'When it rains, I take the bus.'],
        ],
      },
      {
        text: 'Subordinate clause first → main clause starts with the verb.',
        examples: [
          ['Voordat je gaat, moet je betalen.', 'Before you go, you must pay.'],
          ['Nadat we hadden gegeten, gingen we wandelen.', 'After we had eaten, we went for a walk.'],
          ['Terwijl ik kook, luister ik naar de radio.', 'While I cook, I listen to the radio.'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: '___ ik klein was, woonde ik in Turkije.', options: ['Toen', 'Als', 'Wanneer'], answer: 0 },
      { type: 'mc', prompt: '___ het mooi weer is, gaan we naar het strand.', options: ['Als', 'Toen', 'Nadat'], answer: 0 },
      { type: 'mc', prompt: 'Ik poets mijn tanden ___ ik ga slapen.', options: ['voordat', 'nadat', 'toen'], answer: 0 },
      { type: 'mc', prompt: 'Toen ik in Nederland kwam, ___ ik geen Nederlands.', options: ['sprak', 'ik sprak', 'spreek'], answer: 0 },
      { type: 'order', words: ['Als', 'ik', 'tijd', 'heb,', 'lees', 'ik', 'een', 'boek'], en: 'When I have time, I read a book.' },
      { type: 'order', words: ['Terwijl', 'ik', 'kook,', 'luister', 'ik', 'naar', 'muziek'], en: 'While I cook, I listen to music.' },
      { type: 'transform', prompt: 'Ik was jong. Ik speelde veel buiten.', instruction: 'Start with "Toen ik jong was,"', answer: 'Toen ik jong was, speelde ik veel buiten.' },
      { type: 'transform', prompt: 'Je gaat weg. Doe het licht uit.', instruction: 'Start with "Voordat je weggaat,"', answer: 'Voordat je weggaat, doe het licht uit.' },
    ],
  },
  {
    id: 'separable-sub',
    title: 'Scheidbare werkwoorden: samen of apart?',
    titleEn: 'Separable verbs: together or apart?',
    lesson: 33,
    summary: 'Separable verbs split only when they are the conjugated verb in a main clause. They stay together as infinitive (after modals), in subordinate clauses, and with te (in-te-vullen → in te vullen).',
    table: {
      head: ['situation', 'example'],
      rows: [
        ['main clause', 'Ik vul het formulier in.'],
        ['with modal', 'Ik moet het formulier invullen.'],
        ['subordinate clause', '…omdat ik het formulier invul.'],
        ['with te', 'Ik probeer het formulier in te vullen.'],
        ['perfect', 'Ik heb het formulier ingevuld.'],
      ],
    },
    points: [
      {
        text: 'Common separable verbs for official matters: invullen, aanvragen, afsluiten, ophalen, opsturen, inschrijven, afspreken.',
        examples: [
          ['Je kunt online een DigiD aanvragen.', 'You can apply for a DigiD online.'],
          ['Ik weet niet hoe ik een zorgverzekering afsluit.', "I don't know how to take out health insurance."],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Ik ___ het formulier ___.', options: ['vul … in', 'invul … —', 'vul … —'], answer: 0 },
      { type: 'mc', prompt: 'Je moet een nieuw paspoort ___.', options: ['aanvragen', 'vragen aan', 'aan vragen'], answer: 0 },
      { type: 'mc', prompt: 'Ik weet niet of ik een DigiD ___.', options: ['aanvraag', 'vraag aan', 'aan vraag'], answer: 0 },
      { type: 'fill', prompt: 'Ik probeer het formulier in ___ vullen.', answer: 'te' },
      { type: 'fill', prompt: 'Heb je het formulier al ___? (invullen)', answer: 'ingevuld' },
      { type: 'order', words: ['Ik', 'moet', 'een', 'zorgverzekering', 'afsluiten'], en: 'I must take out health insurance.' },
      { type: 'transform', prompt: 'Ik vraag een paspoort aan.', instruction: 'Start with "Ik ga"', answer: 'Ik ga een paspoort aanvragen.' },
      { type: 'transform', prompt: 'Ik schrijf me in bij de gemeente.', instruction: 'Start with "Ik weet dat ik me"', answer: 'Ik weet dat ik me bij de gemeente inschrijf.' },
    ],
  },
  {
    id: 'er-words',
    title: 'Er + voorzetsel: daarover, waarmee',
    titleEn: 'er/daar/waar + preposition',
    lesson: 34,
    summary: 'For things (not people) Dutch does not say "over het" or "met dat". It uses er/daar/hier/waar + preposition: erover, daarmee, hieraan, waarover. Note: met → mee, tot → toe.',
    table: {
      head: ['', 'with a thing'],
      rows: [
        ['praten over (het)', 'erover / daarover praten'],
        ['betalen met (dat)', 'daarmee betalen'],
        ['denken aan (dit)', 'hieraan denken'],
        ['what … about?', 'Waarover praat je? / Waar praat je over?'],
      ],
    },
    points: [
      {
        text: 'The parts can split: Daar praten we nu meer over. Waar denk je aan?',
        examples: [
          ['Daarover praten we nu meer. / Daar praten we nu meer over.', 'We talk about that more now.'],
          ['Waar betaal je mee? — Met mijn pas.', 'What do you pay with? — With my card.'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Het boek? Ik heb ___ gelezen. (about it)', options: ['erover', 'over het', 'over hem'], answer: 0 },
      { type: 'mc', prompt: 'Mijn pas? Ik betaal ___. (with it)', options: ['ermee', 'met het', 'ermet'], answer: 0 },
      { type: 'mc', prompt: '___ denk je aan?', options: ['Waar', 'Wat', 'Wie'], answer: 0 },
      { type: 'mc', prompt: 'Mijn broer? Ik praat vaak ___. (about him)', options: ['over hem', 'erover', 'daarover'], answer: 0, explain: 'For people use the normal pronoun.' },
      { type: 'fill', prompt: 'De oorlog? We praten ___ op school. (daar + over)', answer: 'daarover' },
      { type: 'fill', prompt: 'Een pen? Ik schrijf ___. (er + met)', answer: 'ermee' },
      { type: 'fill', prompt: '___ wacht je op? (what)', answer: 'Waar' },
      { type: 'order', words: ['Daar', 'praten', 'we', 'later', 'over'], en: "We'll talk about that later." },
    ],
  },
  {
    id: 'diminutives',
    title: 'Verkleinwoorden',
    titleEn: 'Diminutives',
    lesson: 35,
    summary: 'Add -je, -tje, -pje, -etje or -kje to make a word small, cute or informal. Diminutives are always het-words; plural with -s.',
    table: {
      head: ['ending', 'rule', 'example'],
      rows: [
        ['-je', 'most words', 'de hond → het hondje'],
        ['-tje', 'after vowel, -l, -n, -r, -w', 'het uur → het uurtje, de stoel → het stoeltje'],
        ['-pje', 'after -m', 'de boom → het boompje'],
        ['-etje', 'short vowel + l/m/n/r/ng', 'de bal → het balletje, de ring → het ringetje'],
        ['-kje', '-ing (sometimes)', 'de woning → het woninkje'],
      ],
    },
    points: [
      {
        text: 'Diminutives often mean "nice/small/informal": een kopje koffie, een uurtje, een dagje uit, even een momentje.',
        examples: [
          ['Wil je een kopje thee?', 'Would you like a cup of tea?'],
          ['We gaan een dagje naar zee.', "We're going to the sea for the day."],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'de hond → het ___', answer: 'hondje' },
      { type: 'fill', prompt: 'het huis → het ___', answer: 'huisje' },
      { type: 'fill', prompt: 'het uur → het ___', answer: 'uurtje' },
      { type: 'fill', prompt: 'de boom → het ___', answer: 'boompje' },
      { type: 'fill', prompt: 'de bal → het ___', answer: 'balletje' },
      { type: 'fill', prompt: 'de vriend → het ___', answer: 'vriendje' },
      { type: 'mc', prompt: '___ meisje speelt buiten.', options: ['Het', 'De'], answer: 0 },
      { type: 'mc', prompt: 'Plural of "het kopje"', options: ['de kopjes', 'de kopjen', 'het kopjes'], answer: 0 },
    ],
  },
];
