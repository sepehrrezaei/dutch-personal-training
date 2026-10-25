import type { GrammarTopic } from '../schema';

export const grammar1: GrammarTopic[] = [
  {
    id: 'present',
    title: 'De tegenwoordige tijd',
    titleEn: 'Present tense',
    lesson: 1,
    summary: 'Take the infinitive (wonen), remove -en to get the stem (woon). Add -t for jij/u/hij/zij/het. All plurals use the infinitive.',
    table: {
      head: ['', 'wonen', 'komen', 'werken'],
      rows: [
        ['ik', 'woon', 'kom', 'werk'],
        ['jij / je', 'woont', 'komt', 'werkt'],
        ['u', 'woont', 'komt', 'werkt'],
        ['hij / zij / het', 'woont', 'komt', 'werkt'],
        ['wij / jullie / zij', 'wonen', 'komen', 'werken'],
      ],
    },
    points: [
      {
        text: 'In a question, when jij/je comes after the verb, drop the -t.',
        examples: [
          ['Jij woont in Utrecht.', 'You live in Utrecht.'],
          ['Woon jij in Utrecht?', 'Do you live in Utrecht?'],
        ],
      },
      {
        text: 'Spelling: keep the vowel sound long. wonen → woon (double o), komen → kom (short o stays single).',
        examples: [
          ['maken → ik maak', 'to make → I make'],
          ['leren → ik leer', 'to learn → I learn'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik ___ uit Polen. (komen)', answer: 'kom' },
      { type: 'fill', prompt: 'Zij ___ in Zeist. (wonen)', answer: 'woont' },
      { type: 'fill', prompt: 'Waar ___ jij? (wonen)', answer: 'woon', explain: 'Jij after the verb: no -t.' },
      { type: 'fill', prompt: 'Jullie ___ in een restaurant. (werken)', answer: 'werken' },
      { type: 'fill', prompt: 'U ___ uit Nederland. (komen)', answer: 'komt' },
      { type: 'fill', prompt: 'Wij ___ Nederlands. (leren)', answer: 'leren' },
      { type: 'fill', prompt: 'Hij ___ brood. (maken)', answer: 'maakt' },
      { type: 'mc', prompt: '___ jij uit Brazilië?', options: ['Kom', 'Komt', 'Komen'], answer: 0 },
      { type: 'order', words: ['Ik', 'woon', 'in', 'het', 'centrum'], en: 'I live in the centre.' },
      { type: 'order', words: ['Waar', 'kom', 'je', 'vandaan?'], en: 'Where do you come from?' },
    ],
  },
  {
    id: 'zijn-hebben',
    title: 'Zijn en hebben',
    titleEn: 'To be and to have',
    lesson: 2,
    summary: 'Zijn (to be) and hebben (to have) are irregular. Learn them by heart — you use them in almost every sentence.',
    table: {
      head: ['', 'zijn', 'hebben'],
      rows: [
        ['ik', 'ben', 'heb'],
        ['jij / je', 'bent (ben jij?)', 'hebt (heb jij?)'],
        ['u', 'bent', 'hebt / heeft'],
        ['hij / zij / het', 'is', 'heeft'],
        ['wij / jullie / zij', 'zijn', 'hebben'],
      ],
    },
    points: [
      {
        text: 'Age uses zijn, not hebben.',
        examples: [
          ['Ik ben dertig (jaar).', 'I am thirty.'],
          ['Hoe oud ben je?', 'How old are you?'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik ___ getrouwd. (zijn)', answer: 'ben' },
      { type: 'fill', prompt: 'Mei ___ twee kinderen. (hebben)', answer: 'heeft' },
      { type: 'fill', prompt: '___ jij kinderen? (hebben)', answer: 'Heb' },
      { type: 'fill', prompt: 'Wij ___ uit China. (zijn)', answer: 'zijn' },
      { type: 'fill', prompt: 'Jij ___ mijn vriend. (zijn)', answer: 'bent' },
      { type: 'fill', prompt: 'De jongen ___ zes jaar. (zijn)', answer: 'is' },
      { type: 'fill', prompt: 'Jullie ___ een groot huis. (hebben)', answer: 'hebben' },
      { type: 'mc', prompt: 'Hoe oud ___ je?', options: ['ben', 'heb', 'bent'], answer: 0, explain: 'Jij after the verb: ben jij / ben je.' },
      { type: 'mc', prompt: 'Ik ___ dertig jaar.', options: ['ben', 'heb', 'is'], answer: 0, explain: 'Age uses zijn.' },
      { type: 'order', words: ['Ze', 'hebben', 'een', 'zoon', 'en', 'een', 'dochter'], en: 'They have a son and a daughter.' },
    ],
  },
  {
    id: 'plural',
    title: 'Meervoud',
    titleEn: 'Plural nouns',
    lesson: 3,
    summary: 'Most nouns take -en. Nouns ending in -el, -em, -en, -er, -je and most words ending in a vowel take -s. In the plural, the article is always "de".',
    table: {
      head: ['singular', 'plural', 'rule'],
      rows: [
        ['de dag', 'de dagen', '-en'],
        ['de week', 'de weken', '-en, long vowel: drop one e'],
        ['de winkel', 'de winkels', '-el → -s'],
        ['het meisje', 'de meisjes', '-je → -s'],
        ['de foto', "de foto's", "vowel → 's"],
        ['het kind', 'de kinderen', 'irregular'],
      ],
    },
    points: [
      {
        text: 'Spelling: a long vowel in an open syllable is written single: maand → maanden, but week → weken, uur → uren. A short vowel doubles the consonant: les → lessen, stad → steden (irregular).',
        examples: [
          ['de les → de lessen', 'class → classes'],
          ['het uur → de uren', 'hour → hours'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'één dag → twee ___', answer: 'dagen' },
      { type: 'fill', prompt: 'één winkel → veel ___', answer: 'winkels' },
      { type: 'fill', prompt: 'één week → zes ___', answer: 'weken' },
      { type: 'fill', prompt: 'één les → drie ___', answer: 'lessen' },
      { type: 'fill', prompt: 'één meisje → twee ___', answer: 'meisjes' },
      { type: 'fill', prompt: 'één kind → twee ___', answer: 'kinderen' },
      { type: 'fill', prompt: 'één school → veel ___', answer: 'scholen' },
      { type: 'fill', prompt: 'één uur → drie ___', answer: 'uren' },
      { type: 'mc', prompt: 'Het meisje → ___ meisjes', options: ['de', 'het', 'een'], answer: 0, explain: 'Plural nouns always take "de".' },
      { type: 'mc', prompt: 'Plural of "de foto"', options: ["foto's", 'fotos', 'fotoen'], answer: 0 },
    ],
  },
  {
    id: 'word-order',
    title: 'De persoonsvorm op plaats 2',
    titleEn: 'Verb in second place (inversion)',
    lesson: 4,
    summary: 'In a main sentence the conjugated verb is always in position 2. If you start with something else than the subject (a time, a place), the subject moves behind the verb.',
    table: {
      head: ['1', '2 (verb)', '3', 'rest'],
      rows: [
        ['Ana', 'heeft', '—', 'op vrijdag les.'],
        ['Op vrijdag', 'heeft', 'Ana', 'les.'],
        ['Vandaag', 'werk', 'ik', 'niet.'],
        ['Waar', 'woon', 'je?', ''],
      ],
    },
    points: [
      {
        text: 'Yes/no questions start with the verb.',
        examples: [
          ['Spreek jij Nederlands?', 'Do you speak Dutch?'],
          ['Heeft u een tas nodig?', 'Do you need a bag?'],
        ],
      },
    ],
    exercises: [
      { type: 'order', words: ['Vandaag', 'werk', 'ik', 'niet'], en: "I'm not working today." },
      { type: 'order', words: ['Op', 'zaterdag', 'gaat', 'Ana', 'naar', 'de', 'markt'], en: 'On Saturday Ana goes to the market.' },
      { type: 'order', words: ["'s", 'Avonds', 'kijk', 'ik', 'televisie'], en: 'In the evening I watch TV.' },
      { type: 'order', words: ['Morgen', 'heb', 'ik', 'les'], en: 'Tomorrow I have class.' },
      { type: 'order', words: ['Spreek', 'jij', 'Nederlands?'], en: 'Do you speak Dutch?' },
      { type: 'transform', prompt: 'Ik heb op maandag les.', instruction: 'Start with "Op maandag"', answer: 'Op maandag heb ik les.' },
      { type: 'transform', prompt: 'Wij gaan morgen naar school.', instruction: 'Start with "Morgen"', answer: 'Morgen gaan wij naar school.' },
      { type: 'transform', prompt: 'Jij woont in Utrecht.', instruction: 'Make it a question', answer: ['Woon jij in Utrecht?', 'Woon je in Utrecht?'] },
      { type: 'mc', prompt: 'Vandaag ___ naar de markt.', options: ['gaat Ana', 'Ana gaat', 'gaan Ana'], answer: 0 },
    ],
  },
  {
    id: 'clock',
    title: 'De klok',
    titleEn: 'Telling the time',
    lesson: 5,
    summary: 'The Dutch count towards the half and the next hour. "Half negen" is 8:30 (half an hour before nine).',
    table: {
      head: ['time', 'Dutch'],
      rows: [
        ['8:00', 'acht uur'],
        ['8:05', 'vijf over acht'],
        ['8:15', 'kwart over acht'],
        ['8:20', 'tien voor half negen'],
        ['8:30', 'half negen'],
        ['8:35', 'vijf over half negen'],
        ['8:45', 'kwart voor negen'],
        ['8:50', 'tien voor negen'],
      ],
    },
    points: [
      {
        text: 'Ask: Hoe laat is het? (What time is it?) Hoe laat begint de les? — Om negen uur (at nine).',
        examples: [
          ['Hoe laat is het? — Het is kwart over drie.', 'What time is it? — Quarter past three.'],
          ['De trein vertrekt om vijf voor half acht.', 'The train leaves at 7:25.'],
        ],
      },
      {
        text: "On timetables and in official texts the 24-hour clock is used: 19.30 uur = half acht 's avonds.",
        examples: [['De winkel is open tot 21.00 uur.', 'The shop is open until 9 pm.']],
      },
    ],
    exercises: [
      { type: 'mc', prompt: '7:30', options: ['half acht', 'half zeven', 'zeven uur dertig'], answer: 0 },
      { type: 'mc', prompt: '9:15', options: ['kwart over negen', 'kwart voor negen', 'kwart over tien'], answer: 0 },
      { type: 'mc', prompt: '4:45', options: ['kwart voor vijf', 'kwart over vier', 'kwart voor vier'], answer: 0 },
      { type: 'mc', prompt: '10:25', options: ['vijf voor half elf', 'vijf over half tien', 'vijf voor half tien'], answer: 0 },
      { type: 'mc', prompt: '2:40', options: ['tien over half drie', 'tien voor half drie', 'twintig voor twee'], answer: 0 },
      { type: 'fill', prompt: '6:00 → zes ___', answer: 'uur' },
      { type: 'fill', prompt: '3:05 → vijf ___ drie', answer: 'over' },
      { type: 'fill', prompt: '11:50 → tien ___ twaalf', answer: 'voor' },
      { type: 'fill', prompt: '1:30 → half ___', answer: 'twee' },
    ],
  },
  {
    id: 'niet-geen',
    title: 'Niet en geen',
    titleEn: 'Negation: niet and geen',
    lesson: 6,
    summary: 'Use "geen" instead of "een" or before a noun without an article. Use "niet" for everything else (verbs, adjectives, nouns with de/het, names).',
    points: [
      {
        text: 'geen = not a / not any.',
        examples: [
          ['Ik heb een tas. → Ik heb geen tas.', 'I have a bag. → I have no bag.'],
          ['Er zijn eieren. → Er zijn geen eieren.', 'There are eggs. → There are no eggs.'],
        ],
      },
      {
        text: 'niet usually goes at the end of the sentence, but before a place, an adjective, or a preposition.',
        examples: [
          ['Ik zie ze niet.', "I don't see them."],
          ['Ik woon niet in Utrecht.', "I don't live in Utrecht."],
          ['De kaas is niet duur.', "The cheese isn't expensive."],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Ik heb ___ kinderen.', options: ['geen', 'niet'], answer: 0 },
      { type: 'mc', prompt: 'Ik woon ___ in het centrum.', options: ['niet', 'geen'], answer: 0 },
      { type: 'mc', prompt: 'Dat is ___ goedkoop.', options: ['niet', 'geen'], answer: 0 },
      { type: 'mc', prompt: 'Er is ___ melk meer.', options: ['geen', 'niet'], answer: 0 },
      { type: 'mc', prompt: 'Ik ken de docent ___.', options: ['niet', 'geen'], answer: 0 },
      { type: 'transform', prompt: 'Ik heb een fiets.', instruction: 'Make it negative', answer: 'Ik heb geen fiets.' },
      { type: 'transform', prompt: 'Hij werkt vandaag.', instruction: 'Make it negative', answer: 'Hij werkt vandaag niet.' },
      { type: 'transform', prompt: 'Wij spreken Engels.', instruction: 'Make it negative', answer: ['Wij spreken geen Engels.', 'Wij spreken niet Engels.'], explain: 'With languages both are used; "geen Engels" is most common.' },
      { type: 'transform', prompt: 'De winkel is open.', instruction: 'Make it negative', answer: 'De winkel is niet open.' },
    ],
  },
  {
    id: 'modals',
    title: 'Kunnen, mogen, willen, moeten',
    titleEn: 'Modal verbs',
    lesson: 6,
    summary: 'A modal verb is in position 2; the second verb goes to the end of the sentence as an infinitive.',
    table: {
      head: ['', 'kunnen', 'mogen', 'willen', 'moeten'],
      rows: [
        ['ik', 'kan', 'mag', 'wil', 'moet'],
        ['jij / je', 'kunt / kan', 'mag', 'wilt / wil', 'moet'],
        ['u', 'kunt', 'mag', 'wilt', 'moet'],
        ['hij / zij', 'kan', 'mag', 'wil', 'moet'],
        ['wij / jullie / zij', 'kunnen', 'mogen', 'willen', 'moeten'],
      ],
    },
    points: [
      {
        text: 'Polite requests: Mag ik … ? Kunt u … ? Ik wil graag …',
        examples: [
          ['Mag ik iets vragen?', 'May I ask something?'],
          ['Kunt u mij helpen?', 'Can you help me?'],
          ['Ik wil graag pinnen.', "I'd like to pay by card."],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: '___ ik iets vragen? (mogen)', answer: 'Mag' },
      { type: 'fill', prompt: '___ u mij helpen? (kunnen)', answer: 'Kunt' },
      { type: 'fill', prompt: 'Ik ___ om acht uur op mijn werk zijn. (moeten)', answer: 'moet' },
      { type: 'fill', prompt: 'Wij ___ in Nederland werken. (willen)', answer: 'willen' },
      { type: 'fill', prompt: 'Hij ___ goed koken. (kunnen)', answer: 'kan' },
      { type: 'order', words: ['Ik', 'wil', 'graag', 'pinnen'], en: "I'd like to pay by card." },
      { type: 'order', words: ['Kunt', 'u', 'mij', 'helpen?'], en: 'Can you help me?' },
      { type: 'order', words: ['Je', 'moet', 'de', 'tekst', 'goed', 'verstaan'], en: 'You must hear the text well.' },
      { type: 'mc', prompt: 'Ik moet morgen ___.', options: ['werken', 'werk', 'werkt'], answer: 0, explain: 'After a modal: infinitive at the end.' },
    ],
  },
  {
    id: 'separable',
    title: 'Scheidbare werkwoorden',
    titleEn: 'Separable verbs',
    lesson: 7,
    summary: 'Many verbs have a prefix that splits off in a main sentence and goes to the end: opzoeken → ik zoek het op. With a modal verb they stay together at the end.',
    table: {
      head: ['infinitive', 'main sentence', 'with modal'],
      rows: [
        ['opzoeken', 'Ik zoek het woord op.', 'Ik moet het woord opzoeken.'],
        ['nazeggen', 'Je zegt de zin na.', 'Je kunt de zin nazeggen.'],
        ['aankomen', 'De trein komt om acht uur aan.', 'De trein moet om acht uur aankomen.'],
        ['meegaan', 'Ga je mee?', 'Wil je meegaan?'],
      ],
    },
    points: [
      {
        text: 'The stress is on the prefix: OPzoeken, NAzeggen, AANkomen. Common prefixes: op, na, aan, mee, af, uit, in, terug, weg.',
        examples: [['Ik ruim mijn kamer op.', 'I tidy up my room.']],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik zoek het woord ___. (opzoeken)', answer: 'op' },
      { type: 'fill', prompt: 'De bus komt om negen uur ___. (aankomen)', answer: 'aan' },
      { type: 'fill', prompt: 'Jullie ___ de zin na. (nazeggen)', answer: 'zeggen' },
      { type: 'fill', prompt: 'Ik moet het woord ___. (opzoeken)', answer: 'opzoeken' },
      { type: 'order', words: ['Ik', 'zeg', 'de', 'zin', 'hardop', 'na'], en: 'I repeat the sentence aloud.' },
      { type: 'order', words: ['Hoe', 'laat', 'komt', 'de', 'trein', 'aan?'], en: 'What time does the train arrive?' },
      { type: 'transform', prompt: 'opzoeken — hij — het woord', instruction: 'Make a main sentence', answer: 'Hij zoekt het woord op.' },
      { type: 'transform', prompt: 'Ik zeg de zin na.', instruction: 'Add "moet"', answer: 'Ik moet de zin nazeggen.' },
      { type: 'mc', prompt: 'Ga je ___ naar de markt?', options: ['mee', 'met', 'op'], answer: 0 },
    ],
  },
];
