import type { GrammarTopic } from '../schema';

export const grammar3: GrammarTopic[] = [
  {
    id: 'object-pronouns',
    title: 'Persoonlijke voornaamwoorden als object',
    titleEn: 'Object pronouns',
    lesson: 15,
    summary: 'After a verb or preposition use the object form: mij/me, jou/je, u, hem, haar, het, ons, jullie, hen/hun/ze. For things: de-word → hem, het-word → het, plural → ze.',
    table: {
      head: ['subject', 'object'],
      rows: [
        ['ik', 'mij / me'],
        ['jij / je', 'jou / je'],
        ['hij', 'hem'],
        ['zij / ze', 'haar'],
        ['het', 'het'],
        ['wij', 'ons'],
        ['jullie', 'jullie'],
        ['zij / ze (people)', 'hen, hun / ze'],
      ],
    },
    points: [
      {
        text: 'Things: the pronoun follows the article of the noun.',
        examples: [
          ['De jas past niet. Ik stuur hem terug.', "The coat doesn't fit. I'm sending it back."],
          ['Het pakje? Ik heb het gebracht.', 'The parcel? I brought it.'],
          ['De schoenen? Ik heb ze besteld.', 'The shoes? I ordered them.'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Waar is de jas? Ik zie ___ niet.', options: ['hem', 'het', 'haar'], answer: 0 },
      { type: 'mc', prompt: 'Waar is het boek? Ik zie ___ niet.', options: ['het', 'hem', 'ze'], answer: 0 },
      { type: 'mc', prompt: 'Ken je mijn zus? Ja, ik ken ___.', options: ['haar', 'hem', 'zij'], answer: 0 },
      { type: 'mc', prompt: 'Kun je ___ helpen? (me)', options: ['mij', 'ik', 'mijn'], answer: 0 },
      { type: 'mc', prompt: 'Waar zijn mijn sleutels? Heb jij ___?', options: ['ze', 'het', 'hem'], answer: 0 },
      { type: 'fill', prompt: 'Ik bel ___ morgen. (hij)', answer: 'hem' },
      { type: 'fill', prompt: 'Wij zien ___ zaterdag. (jullie)', answer: 'jullie' },
      { type: 'fill', prompt: 'Kom je bij ___ eten? (wij)', answer: 'ons' },
      { type: 'transform', prompt: 'Ik heb de broek gekocht.', instruction: 'Replace "de broek" with a pronoun', answer: 'Ik heb hem gekocht.' },
    ],
  },
  {
    id: 'modals-past',
    title: 'Modale werkwoorden in het verleden · hoeven',
    titleEn: 'Modal verbs in the past · hoeven',
    lesson: 16,
    summary: 'Past of the modals: kon/konden, moest/moesten, mocht/mochten, wilde/wilden, zou/zouden. "Hoeven" (need to) is used with niet/geen and te.',
    table: {
      head: ['infinitive', 'past sg', 'past pl'],
      rows: [
        ['kunnen', 'kon', 'konden'],
        ['moeten', 'moest', 'moesten'],
        ['mogen', 'mocht', 'mochten'],
        ['willen', 'wilde', 'wilden'],
        ['zullen', 'zou', 'zouden'],
      ],
    },
    points: [
      {
        text: 'Moeten → negative is "niet hoeven te" (not have to). "Niet moeten" means something stronger (must not / don’t want).',
        examples: [
          ['Je moet een uniform dragen. → Je hoeft geen uniform te dragen.', 'You must wear a uniform. → You don’t have to wear a uniform.'],
          ['Ik hoef morgen niet te werken.', "I don't have to work tomorrow."],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Vroeger ___ ik niet goed rekenen. (kunnen)', answer: 'kon' },
      { type: 'fill', prompt: 'We ___ stil zijn in de klas. (moeten)', answer: 'moesten' },
      { type: 'fill', prompt: 'De kinderen ___ niet praten. (mogen)', answer: 'mochten' },
      { type: 'fill', prompt: 'Ik ___ arts worden. (willen)', answer: 'wilde' },
      { type: 'fill', prompt: 'Je ___ geen uniform te dragen. (hoeven)', answer: 'hoeft' },
      { type: 'transform', prompt: 'Ik moet morgen werken.', instruction: 'Make it negative with hoeven', answer: 'Ik hoef morgen niet te werken.' },
      { type: 'transform', prompt: 'Ik kan zwemmen.', instruction: 'Put in the past (kon)', answer: 'Ik kon zwemmen.' },
      { type: 'mc', prompt: 'Je ___ niet te komen.', options: ['hoeft', 'moet', 'mag'], answer: 0 },
      { type: 'order', words: ['We', 'moesten', 'de', 'baby', 'inschrijven'], en: 'We had to register the baby.' },
    ],
  },
  {
    id: 'imperfect',
    title: 'Het imperfectum (regelmatig)',
    titleEn: 'Simple past (regular verbs)',
    lesson: 17,
    summary: "Regular simple past: stem + -te(n) if the stem ends in 't kofschip (t, k, f, s, ch, p), otherwise stem + -de(n). Used to tell stories and describe how things were.",
    table: {
      head: ['infinitive', 'stem', 'singular', 'plural'],
      rows: [
        ['werken', 'werk', 'werkte', 'werkten'],
        ['koken', 'kook', 'kookte', 'kookten'],
        ['wonen', 'woon', 'woonde', 'woonden'],
        ['zorgen', 'zorg', 'zorgde', 'zorgden'],
        ['verdienen', 'verdien', 'verdiende', 'verdienden'],
      ],
    },
    points: [
      {
        text: 'Watch out for stems ending in v/z: leven → leef → leefde; reizen → reis → reisde (the infinitive has v/z, so -de).',
        examples: [
          ['Hij leefde in Turkije.', 'He lived in Turkey.'],
          ['We reisden door Europa.', 'We travelled through Europe.'],
        ],
      },
      {
        text: 'In speech the perfect is more common; the simple past is used for stories, descriptions and with was/had.',
        examples: [['Vroeger werkte de man en bleef de vrouw thuis.', 'In the past the man worked and the woman stayed at home.']],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Vroeger ___ mijn vader in een fabriek. (werken)', answer: 'werkte' },
      { type: 'fill', prompt: 'Wij ___ in Amsterdam. (wonen)', answer: 'woonden' },
      { type: 'fill', prompt: 'Mijn moeder ___ elke dag. (koken)', answer: 'kookte' },
      { type: 'fill', prompt: 'Ze ___ voor de kinderen. (zorgen)', answer: 'zorgde' },
      { type: 'fill', prompt: 'Hij ___ veel geld. (verdienen)', answer: 'verdiende' },
      { type: 'fill', prompt: 'Ik ___ mijn kamer schoon. (maken)', answer: 'maakte' },
      { type: 'fill', prompt: 'Jullie ___ naar de radio. (luisteren)', answer: 'luisterden' },
      { type: 'mc', prompt: 'Wij ___ door Spanje. (reizen)', options: ['reisden', 'reisten', 'reizden'], answer: 0 },
      { type: 'transform', prompt: 'Ik woon in Rotterdam.', instruction: 'Put in the simple past', answer: 'Ik woonde in Rotterdam.' },
    ],
  },
  {
    id: 'reflexive',
    title: 'Wederkerende werkwoorden',
    titleEn: 'Reflexive verbs',
    lesson: 18,
    summary: 'Some verbs need a reflexive pronoun: zich voelen, zich vervelen, zich inschrijven, zich haasten, zich herinneren, zich voorstellen.',
    table: {
      head: ['', 'zich voelen'],
      rows: [
        ['ik', 'voel me'],
        ['jij', 'voelt je'],
        ['u', 'voelt zich / u'],
        ['hij / zij', 'voelt zich'],
        ['wij', 'voelen ons'],
        ['jullie', 'voelen je'],
        ['zij', 'voelen zich'],
      ],
    },
    points: [
      {
        text: 'The reflexive pronoun comes right after the verb (or after the subject in inversion).',
        examples: [
          ['Ik voel me niet goed.', "I don't feel well."],
          ['Voel je je beter?', 'Do you feel better?'],
          ['Hij schrijft zich in voor de cursus.', 'He signs up for the course.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik voel ___ ziek.', answer: 'me' },
      { type: 'fill', prompt: 'Voel jij ___ beter?', answer: 'je' },
      { type: 'fill', prompt: 'Hij voelt ___ moe.', answer: 'zich' },
      { type: 'fill', prompt: 'Wij vervelen ___ niet.', answer: 'ons' },
      { type: 'fill', prompt: 'Zij schrijven ___ in voor de cursus.', answer: 'zich' },
      { type: 'mc', prompt: 'Jullie moeten ___ haasten!', options: ['je', 'zich', 'jullie'], answer: 0 },
      { type: 'order', words: ['Ik', 'voel', 'me', 'niet', 'goed'], en: "I don't feel well." },
      { type: 'order', words: ['Voelt', 'u', 'zich', 'beter?'], en: 'Do you feel better?' },
      { type: 'transform', prompt: 'Ik voel me moe.', instruction: 'Change "ik" to "zij (she)"', answer: 'Zij voelt zich moe.' },
    ],
  },
  {
    id: 'te-infinitive',
    title: 'Te + infinitief',
    titleEn: 'te + infinitive',
    lesson: 19,
    summary: 'After many verbs a second verb comes with "te" at the end: proberen, vergeten, beginnen, hoeven, durven, hopen, besluiten. Not after modals (kunnen, moeten, willen, mogen) or gaan, komen, blijven, laten.',
    points: [
      {
        text: 'With te: proberen te, vergeten te, beginnen te, hoeven te.',
        examples: [
          ['Ik probeer elke maand te sparen.', 'I try to save every month.'],
          ['Vergeet niet je pas mee te nemen.', "Don't forget to take your card."],
          ['Het begint te regenen.', 'It starts to rain.'],
        ],
      },
      {
        text: 'Without te: modals and gaan, komen, blijven, laten.',
        examples: [
          ['Ik ga morgen sparen.', 'I am going to save tomorrow.'],
          ['Ik wil sparen.', 'I want to save.'],
        ],
      },
      {
        text: 'Separable verbs: te goes between the parts: mee te nemen, over te maken.',
        examples: [['Ik probeer geld over te maken.', 'I try to transfer money.']],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Ik probeer elke week ___.', options: ['te sparen', 'sparen'], answer: 0 },
      { type: 'mc', prompt: 'Ik wil elke week ___.', options: ['sparen', 'te sparen'], answer: 0 },
      { type: 'mc', prompt: 'Je hoeft niet ___ komen.', options: ['te', '—'], answer: 0 },
      { type: 'mc', prompt: 'We gaan morgen ___.', options: ['fietsen', 'te fietsen'], answer: 0 },
      { type: 'fill', prompt: 'Het begint ___ regenen.', answer: 'te' },
      { type: 'fill', prompt: 'Vergeet niet je pas mee ___ nemen.', answer: 'te' },
      { type: 'order', words: ['Ik', 'probeer', 'Nederlands', 'te', 'spreken'], en: 'I try to speak Dutch.' },
      { type: 'transform', prompt: 'Ik maak geld over.', instruction: 'Start with "Ik probeer"', answer: 'Ik probeer geld over te maken.' },
      { type: 'transform', prompt: 'Ik bel de bank.', instruction: 'Start with "Ik vergeet"', answer: 'Ik vergeet de bank te bellen.' },
    ],
  },
  {
    id: 'imperfect-irregular',
    title: 'Het imperfectum (onregelmatig)',
    titleEn: 'Simple past (irregular verbs)',
    lesson: 20,
    summary: 'Many frequent verbs change their vowel in the simple past. Singular and plural: ging / gingen, kwam / kwamen. Learn the most common ones.',
    table: {
      head: ['infinitive', 'past sg', 'past pl', 'perfect'],
      rows: [
        ['gaan', 'ging', 'gingen', 'is gegaan'],
        ['komen', 'kwam', 'kwamen', 'is gekomen'],
        ['zijn', 'was', 'waren', 'is geweest'],
        ['hebben', 'had', 'hadden', 'heeft gehad'],
        ['zien', 'zag', 'zagen', 'heeft gezien'],
        ['doen', 'deed', 'deden', 'heeft gedaan'],
        ['vliegen', 'vloog', 'vlogen', 'heeft/is gevlogen'],
        ['vertrekken', 'vertrok', 'vertrokken', 'is vertrokken'],
        ['slapen', 'sliep', 'sliepen', 'heeft geslapen'],
        ['eten', 'at', 'aten', 'heeft gegeten'],
      ],
    },
    points: [
      {
        text: 'Use the simple past to tell a story in order: first this, then that.',
        examples: [
          ['We kwamen te laat en het vliegtuig vertrok zonder ons.', 'We arrived late and the plane left without us.'],
          ['We zagen bergen en we sliepen in een tent.', 'We saw mountains and we slept in a tent.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Vorig jaar ___ we naar Spanje. (gaan)', answer: 'gingen' },
      { type: 'fill', prompt: 'De trein ___ te laat. (komen)', answer: 'kwam' },
      { type: 'fill', prompt: 'Het ___ een mooie reis. (zijn)', answer: 'was' },
      { type: 'fill', prompt: 'We ___ veel mooie dorpen. (zien)', answer: 'zagen' },
      { type: 'fill', prompt: 'Ik ___ in een hotel. (slapen)', answer: 'sliep' },
      { type: 'fill', prompt: 'Het vliegtuig ___ om acht uur. (vertrekken)', answer: 'vertrok' },
      { type: 'fill', prompt: 'Wat ___ jullie gisteren? (doen)', answer: 'deden' },
      { type: 'fill', prompt: 'We ___ vis op het strand. (eten)', answer: 'aten' },
      { type: 'mc', prompt: 'Zij ___ geen tijd.', options: ['had', 'hadde', 'hebte'], answer: 0 },
    ],
  },
  {
    id: 'subordinate',
    title: 'Bijzinnen: omdat, dat, als, wanneer',
    titleEn: 'Subordinate clauses',
    lesson: 21,
    summary: 'After omdat, dat, als, wanneer, toen, of, waar, hoe … the conjugated verb goes to the END of the clause. After want, maar, en, of, dus the word order stays normal.',
    table: {
      head: ['main clause', 'conjunction', 'subordinate clause (verb last)'],
      rows: [
        ['Ik ga niet mee,', 'omdat', 'ik bang ben voor hoogte.'],
        ['Ik hoop', 'dat', 'het mooi weer wordt.'],
        ['Ik bel je', 'als', 'ik thuis ben.'],
        ['Ik ga niet mee,', 'want', 'ik ben bang voor hoogte. (normal order)'],
      ],
    },
    points: [
      {
        text: 'With two verbs, both go to the end (in any order): …omdat ik morgen moet werken / werken moet.',
        examples: [
          ['Ik kom niet, omdat ik moet werken.', "I'm not coming, because I have to work."],
          ['Ze zegt dat ze ziek is geweest.', 'She says that she has been ill.'],
        ],
      },
      {
        text: 'If the subordinate clause comes first, the main clause starts with the verb.',
        examples: [['Als het regent, ga ik met de bus.', 'If it rains, I go by bus.']],
      },
    ],
    exercises: [
      { type: 'order', words: ['Ik', 'blijf', 'thuis,', 'omdat', 'ik', 'ziek', 'ben'], en: "I'm staying home because I'm ill." },
      { type: 'order', words: ['Ik', 'hoop', 'dat', 'je', 'komt'], en: 'I hope that you come.' },
      { type: 'order', words: ['Als', 'het', 'regent,', 'neem', 'ik', 'de', 'bus'], en: 'If it rains, I take the bus.' },
      { type: 'transform', prompt: 'Ik kom niet. Ik ben moe.', instruction: 'Join with "omdat"', answer: 'Ik kom niet, omdat ik moe ben.' },
      { type: 'transform', prompt: 'Ik kom niet. Ik ben moe.', instruction: 'Join with "want"', answer: 'Ik kom niet, want ik ben moe.' },
      { type: 'transform', prompt: 'Het wordt mooi weer.', instruction: 'Start with "Ik hoop dat"', answer: 'Ik hoop dat het mooi weer wordt.' },
      { type: 'mc', prompt: 'Ik leer Nederlands, omdat ik hier ___.', options: ['wil werken', 'werken wil ik', 'wil ik werken'], answer: 0 },
      { type: 'mc', prompt: 'Ik leer Nederlands, want ik ___ hier werken.', options: ['wil', 'werken wil', 'te willen'], answer: 0 },
      { type: 'mc', prompt: 'Als ik tijd heb, ___ ik je.', options: ['bel', 'bellen', 'ik bel'], answer: 0 },
    ],
  },
];
