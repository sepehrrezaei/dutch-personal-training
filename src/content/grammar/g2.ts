import type { GrammarTopic } from '../schema';

export const grammar2: GrammarTopic[] = [
  {
    id: 'er',
    title: 'Het woordje "er"',
    titleEn: 'The little word "er"',
    lesson: 8,
    summary: '"Er" has several jobs. At A2 you need three: "er is / er zijn" (there is/are), "er" as a place (there), and "er" with a number (of them).',
    points: [
      {
        text: 'Er is / er zijn = there is / there are. Use it to say something exists.',
        examples: [
          ['Er is altijd thee.', 'There is always tea.'],
          ['Er zijn geen eieren meer.', 'There are no more eggs.'],
        ],
      },
      {
        text: 'With a number: "er" replaces the noun.',
        examples: [
          ['Hoeveel kinderen heb je? — Ik heb er twee.', 'How many children do you have? — I have two (of them).'],
          ['Ik ken er drie.', 'I know three of them.'],
        ],
      },
      {
        text: 'As a place: "er" = there (unstressed).',
        examples: [['Ik woon in Utrecht. Ik woon er al drie jaar.', 'I live in Utrecht. I have lived there for three years.']],
      },
    ],
    exercises: [
      { type: 'fill', prompt: '___ is een supermarkt in mijn straat.', answer: 'Er' },
      { type: 'fill', prompt: '___ zijn veel fietsen in Nederland.', answer: 'Er' },
      { type: 'fill', prompt: 'Hoeveel broers heb je? — Ik heb ___ twee.', answer: 'er' },
      { type: 'mc', prompt: 'Is er nog koffie? — Nee, er is ___ koffie meer.', options: ['geen', 'niet', 'er'], answer: 0 },
      { type: 'mc', prompt: 'Woon je in Zeist? — Ja, ik woon ___ sinds mei.', options: ['er', 'het', 'daar het'], answer: 0 },
      { type: 'order', words: ['Er', 'is', 'altijd', 'thee'], en: 'There is always tea.' },
      { type: 'order', words: ['Ik', 'heb', 'er', 'drie'], en: 'I have three (of them).' },
      { type: 'transform', prompt: 'Ik heb twee kinderen.', instruction: 'Replace "kinderen" with er', answer: 'Ik heb er twee.' },
      { type: 'transform', prompt: 'Een supermarkt is in de straat.', instruction: 'Start with "Er"', answer: 'Er is een supermarkt in de straat.' },
    ],
  },
  {
    id: 'perfect',
    title: 'Het perfectum',
    titleEn: 'Perfect tense (past)',
    lesson: 9,
    summary: 'To talk about the past in speech, Dutch mostly uses hebben or zijn + past participle. The participle goes to the end. Regular: ge + stem + t/d.',
    table: {
      head: ['infinitive', 'stem', 'participle', 'rule'],
      rows: [
        ['werken', 'werk', 'gewerkt', 'stem ends in t k f s ch p → -t'],
        ['fietsen', 'fiets', 'gefietst', "'t kofschip: -t"],
        ['wonen', 'woon', 'gewoond', 'other sounds → -d'],
        ['wachten', 'wacht', 'gewacht', 'stem already ends in t: no extra t'],
        ['betalen', 'betaal', 'betaald', 'be-, ge-, ver-, her-, ont-: no extra ge-'],
      ],
    },
    points: [
      {
        text: "Remember the -t sounds with 't kofschip (t, k, f, s, ch, p). If the stem ends in one of these, add -t; otherwise -d.",
        examples: [
          ['Ik heb twintig minuten gewacht.', 'I waited for twenty minutes.'],
          ['We hebben in Utrecht gewoond.', 'We lived in Utrecht.'],
        ],
      },
      {
        text: 'Most verbs use hebben. Verbs of movement to a place and change use zijn: gaan, komen, vertrekken, worden, blijven.',
        examples: [
          ['Ik ben met de trein gegaan.', 'I went by train.'],
          ['Hoe ben je gekomen?', 'How did you come?'],
          ['Ik heb gefietst. / Ik ben naar huis gefietst.', 'I cycled. / I cycled home (to a place → zijn).'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Ik heb gisteren ___. (werken)', answer: 'gewerkt' },
      { type: 'fill', prompt: 'We hebben in Polen ___. (wonen)', answer: 'gewoond' },
      { type: 'fill', prompt: 'Hij heeft een uur ___. (wachten)', answer: 'gewacht' },
      { type: 'fill', prompt: 'Ik heb met de pinpas ___. (betalen)', answer: 'betaald' },
      { type: 'fill', prompt: 'Zij heeft Nederlands ___. (leren)', answer: 'geleerd' },
      { type: 'mc', prompt: 'Ik ___ met de bus gekomen.', options: ['ben', 'heb'], answer: 0 },
      { type: 'mc', prompt: 'Wij ___ de hele dag gewerkt.', options: ['hebben', 'zijn'], answer: 0 },
      { type: 'mc', prompt: 'Ana ___ naar Zeist gegaan.', options: ['is', 'heeft'], answer: 0 },
      { type: 'transform', prompt: 'Ik fiets naar school.', instruction: 'Put in the perfect tense', answer: 'Ik ben naar school gefietst.' },
      { type: 'transform', prompt: 'Hij maakt huiswerk.', instruction: 'Put in the perfect tense', answer: 'Hij heeft huiswerk gemaakt.' },
      { type: 'order', words: ['Ik', 'heb', 'twintig', 'minuten', 'gewacht'], en: 'I waited twenty minutes.' },
    ],
  },
  {
    id: 'comparative',
    title: 'Vergelijken',
    titleEn: 'Comparing: -er, het -st',
    lesson: 10,
    summary: 'Comparative: adjective + -er (+ dan). Superlative: het + adjective + -st, or de/het …-ste before a noun. Adjectives ending in -r add -der.',
    table: {
      head: ['', 'comparative', 'superlative'],
      rows: [
        ['warm', 'warmer', 'het warmst / de warmste dag'],
        ['koud', 'kouder', 'het koudst'],
        ['groot', 'groter', 'het grootst'],
        ['duur', 'duurder', 'het duurst'],
        ['goed', 'beter', 'het best'],
        ['veel', 'meer', 'het meest'],
        ['weinig', 'minder', 'het minst'],
        ['graag', 'liever', 'het liefst'],
      ],
    },
    points: [
      {
        text: 'Use "dan" (than) to compare. Use "steeds + comparative" for "more and more".',
        examples: [
          ['In Polen is het kouder dan hier.', 'In Poland it is colder than here.'],
          ['De zomers worden steeds warmer.', 'Summers are getting warmer and warmer.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Brazilië is ___ dan Nederland. (warm)', answer: 'warmer' },
      { type: 'fill', prompt: 'Een auto is ___ dan een fiets. (duur)', answer: 'duurder' },
      { type: 'fill', prompt: 'Amsterdam is ___ dan Utrecht. (groot)', answer: 'groter' },
      { type: 'fill', prompt: 'Mijn Nederlands wordt steeds ___. (goed)', answer: 'beter' },
      { type: 'fill', prompt: 'Ik drink ___ thee dan koffie. (graag)', answer: 'liever' },
      { type: 'mc', prompt: 'De winter is de ___ tijd van het jaar.', options: ['koudste', 'kouder', 'koudst'], answer: 0 },
      { type: 'mc', prompt: 'Wie spreekt het ___ Nederlands?', options: ['best', 'beter', 'goedst'], answer: 0 },
      { type: 'mc', prompt: 'Hij werkt ___ dan ik.', options: ['meer', 'veeler', 'meest'], answer: 0 },
      { type: 'order', words: ['De', 'dagen', 'worden', 'steeds', 'korter'], en: 'The days are getting shorter and shorter.' },
    ],
  },
  {
    id: 'de-het',
    title: 'De of het · deze/die · dit/dat',
    titleEn: 'Articles and demonstratives',
    lesson: 11,
    summary: 'Every noun is a de-word or a het-word. About two thirds are de-words. All plurals are de. Learn each noun with its article.',
    table: {
      head: ['', 'de-word', 'het-word', 'plural'],
      rows: [
        ['the', 'de kamer', 'het huis', 'de huizen'],
        ['this/these', 'deze kamer', 'dit huis', 'deze huizen'],
        ['that/those', 'die kamer', 'dat huis', 'die huizen'],
      ],
    },
    points: [
      {
        text: 'Always het: diminutives (-je: het meisje, het huisje), most words with -ment, -um, -isme, languages (het Nederlands), infinitives as nouns (het eten).',
        examples: [
          ['het appartement, het centrum', 'the apartment, the centre'],
          ['het lijstje, het briefje', 'the little list, the note'],
        ],
      },
      {
        text: 'Always de: people (de man, de docent), plurals, most words ending in -ing, -heid, -ie, -teit, -tie.',
        examples: [
          ['de woning, de vrijheid, de familie', 'the dwelling, freedom, the family'],
          ['de nationaliteit, de informatie', 'nationality, information'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: '___ huis is groot.', options: ['Het', 'De'], answer: 0 },
      { type: 'mc', prompt: '___ keuken is klein.', options: ['De', 'Het'], answer: 0 },
      { type: 'mc', prompt: 'Ik woon in ___ appartement. (this)', options: ['dit', 'deze'], answer: 0 },
      { type: 'mc', prompt: 'Wie is ___ man? (that)', options: ['die', 'dat'], answer: 0 },
      { type: 'mc', prompt: '___ kamers zijn duur. (these)', options: ['Deze', 'Dit'], answer: 0 },
      { type: 'mc', prompt: '___ meisje heet Lily.', options: ['Het', 'De'], answer: 0, explain: '-je words are always het.' },
      { type: 'mc', prompt: '___ woning heeft een tuin.', options: ['De', 'Het'], answer: 0, explain: '-ing words are de.' },
      { type: 'fill', prompt: '___ centrum is druk. (the)', answer: 'Het' },
      { type: 'fill', prompt: 'Ik vind ___ buurt mooi. (this)', answer: 'deze' },
      { type: 'fill', prompt: '___ boek is van mij. (that)', answer: 'Dat' },
    ],
  },
  {
    id: 'imperative',
    title: 'De gebiedende wijs',
    titleEn: 'Imperative (giving instructions)',
    lesson: 12,
    summary: 'For instructions and directions use the stem of the verb, at the start of the sentence. For politeness add "maar", "even" or "alstublieft", or use "u" with the -t form.',
    points: [
      {
        text: 'Imperative = stem. Separable verbs split as usual.',
        examples: [
          ['Ga rechtdoor.', 'Go straight on.'],
          ['Neem de trap.', 'Take the stairs.'],
          ['Steek de weg over.', 'Cross the road.'],
        ],
      },
      {
        text: 'Softer: "Kom maar binnen." "Wacht even." Very polite: "Komt u binnen."',
        examples: [
          ['Kijk even hier.', 'Just look here.'],
          ['Gaat u zitten.', 'Please sit down.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: '___ rechtdoor tot het stoplicht. (gaan)', answer: 'Ga' },
      { type: 'fill', prompt: '___ de tweede straat links. (nemen)', answer: 'Neem' },
      { type: 'fill', prompt: '___ de weg over. (oversteken)', answer: 'Steek' },
      { type: 'fill', prompt: '___ maar binnen! (komen)', answer: 'Kom' },
      { type: 'fill', prompt: '___ even op mij. (wachten)', answer: 'Wacht' },
      { type: 'order', words: ['Ga', 'bij', 'de', 'kerk', 'linksaf'], en: 'Turn left at the church.' },
      { type: 'order', words: ['Steek', 'het', 'plein', 'over'], en: 'Cross the square.' },
      { type: 'transform', prompt: 'Je moet de trein nemen.', instruction: 'Make it an instruction', answer: 'Neem de trein.' },
      { type: 'mc', prompt: 'Polite: ___ u zitten.', options: ['Gaat', 'Ga', 'Gaan'], answer: 0 },
    ],
  },
  {
    id: 'perfect-irregular',
    title: 'Onregelmatige voltooide deelwoorden',
    titleEn: 'Irregular past participles',
    lesson: 13,
    summary: 'Many common verbs have an irregular participle, often ending in -en. Learn them as a list: they are used every day.',
    table: {
      head: ['infinitive', 'participle', 'aux'],
      rows: [
        ['eten', 'gegeten', 'hebben'],
        ['drinken', 'gedronken', 'hebben'],
        ['kijken', 'gekeken', 'hebben'],
        ['spreken', 'gesproken', 'hebben'],
        ['zien', 'gezien', 'hebben'],
        ['doen', 'gedaan', 'hebben'],
        ['hebben', 'gehad', 'hebben'],
        ['zijn', 'geweest', 'zijn'],
        ['gaan', 'gegaan', 'zijn'],
        ['komen', 'gekomen', 'zijn'],
        ['blijven', 'gebleven', 'zijn'],
      ],
    },
    points: [
      {
        text: 'Separable verbs put ge- between prefix and verb: opruimen → opgeruimd, uitslapen → uitgeslapen.',
        examples: [
          ['Ik heb mijn kamer opgeruimd.', 'I tidied up my room.'],
          ['Ik heb lekker uitgeslapen.', 'I had a nice lie-in.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'We hebben vis ___. (eten)', answer: 'gegeten' },
      { type: 'fill', prompt: 'Ik heb een film ___. (kijken)', answer: 'gekeken' },
      { type: 'fill', prompt: 'Zij is in Den Haag ___. (zijn)', answer: 'geweest' },
      { type: 'fill', prompt: 'Heb je een leuk weekend ___? (hebben)', answer: 'gehad' },
      { type: 'fill', prompt: 'Wat heb je ___? (doen)', answer: 'gedaan' },
      { type: 'fill', prompt: 'Ik heb met de docent ___. (spreken)', answer: 'gesproken' },
      { type: 'fill', prompt: 'Ik heb mijn kamer ___. (opruimen)', answer: 'opgeruimd' },
      { type: 'mc', prompt: 'Mijn ouders ___ op bezoek geweest.', options: ['zijn', 'hebben'], answer: 0 },
      { type: 'transform', prompt: 'Ik drink koffie.', instruction: 'Put in the perfect tense', answer: 'Ik heb koffie gedronken.' },
      { type: 'transform', prompt: 'Wij gaan naar het strand.', instruction: 'Put in the perfect tense', answer: 'Wij zijn naar het strand gegaan.' },
    ],
  },
  {
    id: 'adjectives',
    title: 'Bijvoeglijke naamwoorden en bezit',
    titleEn: 'Adjectives (-e) and possessives',
    lesson: 14,
    summary: 'An adjective before a noun gets -e, except with het-words after een / geen / no article in the singular. After the verb (is, wordt) there is no -e.',
    table: {
      head: ['', 'de-word', 'het-word'],
      rows: [
        ['the', 'de mooie foto', 'het grote gezin'],
        ['a / no', 'een mooie foto', 'een groot gezin'],
        ['plural', 'mooie foto’s', 'grote gezinnen'],
        ['after verb', 'de foto is mooi', 'het gezin is groot'],
      ],
    },
    points: [
      {
        text: 'Possessives: mijn, jouw (je), uw, zijn, haar, ons/onze, jullie, hun. "Ons" for het-words, "onze" for de-words and plurals.',
        examples: [
          ['ons huis, onze tuin, onze kinderen', 'our house, our garden, our children'],
          ['Hun ouders zijn gescheiden.', 'Their parents are divorced.'],
        ],
      },
      {
        text: 'Spelling with -e: long vowel → single letter (groot → grote), short vowel → double consonant (wit → witte), f → v, s → z (lief → lieve, grijs → grijze).',
        examples: [['een witte fiets, een lieve oma', 'a white bike, a sweet grandma']],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Wat een ___ foto! (mooi)', answer: 'mooie' },
      { type: 'fill', prompt: 'Ze hebben een ___ gezin. (groot)', answer: 'groot', explain: 'het-word after een: no -e.' },
      { type: 'fill', prompt: 'Het ___ gezin woont in Turkije. (groot)', answer: 'grote' },
      { type: 'fill', prompt: 'De foto is ___. (mooi)', answer: 'mooi', explain: 'After the verb: no -e.' },
      { type: 'fill', prompt: 'Ik heb een ___ fiets. (wit)', answer: 'witte' },
      { type: 'mc', prompt: 'Dit is ___ huis. (our)', options: ['ons', 'onze'], answer: 0 },
      { type: 'mc', prompt: 'Dit zijn ___ kinderen. (our)', options: ['onze', 'ons'], answer: 0 },
      { type: 'mc', prompt: 'Mei en Wei wonen met ___ kinderen in Utrecht.', options: ['hun', 'haar', 'zijn'], answer: 0 },
      { type: 'mc', prompt: 'Ana belt ___ zus.', options: ['haar', 'zijn', 'hun'], answer: 0 },
      { type: 'order', words: ['Mijn', 'jongste', 'broer', 'studeert', 'nog'], en: 'My youngest brother is still studying.' },
    ],
  },
];
