import type { GrammarTopic } from '../schema';

export const grammar6: GrammarTopic[] = [
  {
    id: 'zitten-staan-liggen',
    title: 'Zitten, staan, liggen',
    titleEn: 'Position verbs',
    lesson: 36,
    summary: 'Dutch often uses zitten, staan or liggen instead of "zijn" to say where something is. Staan = upright (bottles, buildings, text on paper), liggen = flat (books on a table, cities, countries), zitten = inside something (in a bag, in the ground).',
    points: [
      {
        text: 'Choose the verb by the shape or position of the thing.',
        examples: [
          ['De fles staat op tafel.', 'The bottle is (standing) on the table.'],
          ['Het boek ligt op tafel.', 'The book is (lying) on the table.'],
          ['De sleutels zitten in mijn tas.', 'The keys are in my bag.'],
          ['Utrecht ligt in het midden van het land.', 'Utrecht lies in the middle of the country.'],
          ['Wat staat er in de brief?', 'What does the letter say?'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Het boek ___ op de tafel.', options: ['ligt', 'staat', 'zit'], answer: 0 },
      { type: 'mc', prompt: 'De fles ___ in de koelkast.', options: ['staat', 'ligt', 'zit'], answer: 0 },
      { type: 'mc', prompt: 'Mijn telefoon ___ in mijn jas.', options: ['zit', 'staat', 'ligt'], answer: 0 },
      { type: 'mc', prompt: 'Friesland ___ in het noorden.', options: ['ligt', 'staat', 'zit'], answer: 0 },
      { type: 'mc', prompt: 'Er ___ een kerk op het plein.', options: ['staat', 'ligt', 'zit'], answer: 0 },
      { type: 'mc', prompt: 'Wat ___ er in de krant?', options: ['staat', 'ligt', 'zit'], answer: 0 },
      { type: 'mc', prompt: 'Er ___ gas in de bodem.', options: ['zit', 'staat', 'ligt'], answer: 0 },
      { type: 'fill', prompt: 'De kinderen ___ op school. (zitten)', answer: 'zitten' },
    ],
  },
  {
    id: 'passive-past',
    title: 'De lijdende vorm in het verleden',
    titleEn: 'The passive in the past',
    lesson: 37,
    summary: 'Past passive: werd/werden + participle (simple past) or is/zijn + participle (perfect). "Het huis werd gebouwd" and "Het huis is gebouwd" both mean "The house was built".',
    table: {
      head: ['tense', 'example'],
      rows: [
        ['present', 'Het gemeentehuis wordt gebouwd.'],
        ['simple past', 'Het gemeentehuis werd in 1890 gebouwd.'],
        ['perfect', 'Het gemeentehuis is in 2015 geopend.'],
        ['plural past', 'De huizen werden gebouwd. / zijn gebouwd.'],
      ],
    },
    points: [
      {
        text: 'Use "door" for who did it.',
        examples: [['De burgemeester wordt benoemd door de regering.', 'The mayor is appointed by the government.']],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Het gemeentehuis ___ in 1890 gebouwd. (werd/werden)', answer: 'werd' },
      { type: 'fill', prompt: 'De huizen ___ na de oorlog gebouwd. (werd/werden)', answer: 'werden' },
      { type: 'fill', prompt: 'Het museum is in 2015 ___. (openen)', answer: 'geopend' },
      { type: 'fill', prompt: 'De brief is gisteren ___. (versturen)', answer: 'verstuurd' },
      { type: 'mc', prompt: 'Mijn fiets ___ gestolen!', options: ['is', 'heeft', 'wordt'], answer: 0 },
      { type: 'mc', prompt: 'Amsterdam ___ in de dertiende eeuw gesticht.', options: ['werd', 'wordt', 'heeft'], answer: 0 },
      { type: 'transform', prompt: 'Men bouwde de dijk in 1950.', instruction: 'Make it passive with werd', answer: 'De dijk werd in 1950 gebouwd.' },
      { type: 'transform', prompt: 'Iemand heeft mijn fiets gestolen.', instruction: 'Make it passive (Mijn fiets is …)', answer: 'Mijn fiets is gestolen.' },
    ],
  },
  {
    id: 'future',
    title: 'De toekomst: zullen, gaan, tegenwoordige tijd',
    titleEn: 'Talking about the future',
    lesson: 38,
    summary: 'Dutch usually uses the present tense with a time word for the future (Morgen werk ik). "Gaan + infinitive" = going to (plans). "Zullen + infinitive" = will (predictions, promises, formal).',
    points: [
      {
        text: 'Three ways',
        examples: [
          ['Morgen fiets ik naar mijn werk.', "Tomorrow I'll cycle to work."],
          ['Ik ga volgend jaar met de trein.', "I'm going to take the train next year."],
          ['Er zullen meer stormen komen.', 'There will be more storms.'],
          ['Ik zal je helpen.', 'I will help you (promise).'],
        ],
      },
    ],
    table: {
      head: ['', 'zullen'],
      rows: [
        ['ik', 'zal'],
        ['jij', 'zult / zal'],
        ['hij / zij', 'zal'],
        ['wij / jullie / zij', 'zullen'],
      ],
    },
    exercises: [
      { type: 'fill', prompt: 'Het ___ morgen regenen. (zullen)', answer: 'zal' },
      { type: 'fill', prompt: 'Wij ___ je helpen. (zullen)', answer: 'zullen' },
      { type: 'fill', prompt: 'Ik ___ volgend jaar studeren. (gaan)', answer: 'ga' },
      { type: 'mc', prompt: 'Volgende week ___ ik naar Spanje.', options: ['ga', 'gaan', 'zal gaan te'], answer: 0 },
      { type: 'order', words: ['Ik', 'ga', 'minder', 'vlees', 'eten'], en: "I'm going to eat less meat." },
      { type: 'order', words: ['Er', 'zullen', 'meer', 'stormen', 'komen'], en: 'There will be more storms.' },
      { type: 'transform', prompt: 'Ik fiets naar mijn werk.', instruction: 'Use "gaan" for a plan', answer: 'Ik ga naar mijn werk fietsen.' },
      { type: 'transform', prompt: 'De temperatuur stijgt.', instruction: 'Use "zullen" (prediction)', answer: 'De temperatuur zal stijgen.' },
    ],
  },
  {
    id: 'irregular-review',
    title: 'Onregelmatige werkwoorden: overzicht',
    titleEn: 'Irregular verbs review',
    lesson: 39,
    summary: 'The most frequent verbs are irregular. Learn the three forms together: infinitive – simple past – participle (with hebben or zijn).',
    table: {
      head: ['infinitive', 'past', 'perfect'],
      rows: [
        ['kiezen', 'koos / kozen', 'heeft gekozen'],
        ['krijgen', 'kreeg / kregen', 'heeft gekregen'],
        ['zeggen', 'zei / zeiden', 'heeft gezegd'],
        ['nemen', 'nam / namen', 'heeft genomen'],
        ['gaan', 'ging / gingen', 'is gegaan'],
        ['doen', 'deed / deden', 'heeft gedaan'],
        ['weten', 'wist / wisten', 'heeft geweten'],
        ['kunnen', 'kon / konden', 'heeft gekund'],
        ['denken', 'dacht / dachten', 'heeft gedacht'],
        ['brengen', 'bracht / brachten', 'heeft gebracht'],
        ['blijven', 'bleef / bleven', 'is gebleven'],
        ['schrijven', 'schreef / schreven', 'heeft geschreven'],
      ],
    },
    points: [
      {
        text: 'Regular verbs for comparison: stemmen – stemde – gestemd; werken – werkte – gewerkt.',
        examples: [
          ['Ik stemde. / Ik heb gestemd.', 'I voted.'],
          ['De bevolking koos de Kamer. / heeft de Kamer gekozen.', 'The population elected the House.'],
        ],
      },
    ],
    exercises: [
      { type: 'fill', prompt: 'Vorig jaar ___ ik voor het eerst. (stemmen, past)', answer: 'stemde' },
      { type: 'fill', prompt: 'De mensen ___ een nieuwe regering. (kiezen, past)', answer: 'kozen' },
      { type: 'fill', prompt: 'Hij heeft een brief ___. (krijgen)', answer: 'gekregen' },
      { type: 'fill', prompt: 'Wat ___ de minister? (zeggen, past)', answer: 'zei' },
      { type: 'fill', prompt: 'Ik heb een besluit ___. (nemen)', answer: 'genomen' },
      { type: 'fill', prompt: 'Ik ___ het niet. (weten, past)', answer: 'wist' },
      { type: 'fill', prompt: 'We ___ thuis. (blijven, past plural)', answer: 'bleven' },
      { type: 'fill', prompt: 'Zij heeft een boek ___. (schrijven)', answer: 'geschreven' },
      { type: 'mc', prompt: 'Ik ___ dat het makkelijk was.', options: ['dacht', 'denkte', 'docht'], answer: 0 },
    ],
  },
  {
    id: 'welk-elk',
    title: 'Welk(e), elk(e), ons/onze',
    titleEn: 'which, each, our',
    lesson: 40,
    summary: 'These words follow the de/het rule: without -e before singular het-words, with -e before de-words and plurals.',
    table: {
      head: ['', 'het-word (singular)', 'de-word / plural'],
      rows: [
        ['which', 'welk huis', 'welke straat / welke huizen'],
        ['each, every', 'elk kind', 'elke dag'],
        ['our', 'ons land', 'onze ouders'],
        ['some', 'sommig werk (rare)', 'sommige mensen'],
      ],
    },
    points: [
      {
        text: 'Ieder(e) is the same as elk(e).',
        examples: [
          ['Elke dag eet ik brood. / Iedere dag …', 'Every day I eat bread.'],
          ['Welk boek lees je?', 'Which book are you reading?'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: '___ boek lees je?', options: ['Welk', 'Welke'], answer: 0 },
      { type: 'mc', prompt: '___ dag fiets ik naar mijn werk.', options: ['Elke', 'Elk'], answer: 0 },
      { type: 'mc', prompt: 'Dit is ___ land.', options: ['ons', 'onze'], answer: 0 },
      { type: 'mc', prompt: '___ kinderen spelen buiten.', options: ['Onze', 'Ons'], answer: 0 },
      { type: 'mc', prompt: 'In ___ stad woon je?', options: ['welke', 'welk'], answer: 0 },
      { type: 'mc', prompt: '___ kind krijgt een cadeau.', options: ['Elk', 'Elke'], answer: 0 },
      { type: 'fill', prompt: '___ mensen werken op zaterdag. (some)', answer: 'Sommige' },
      { type: 'fill', prompt: 'Wij houden van ___ buurt. (our)', answer: 'onze' },
    ],
  },
  {
    id: 'indirect-questions',
    title: 'Indirecte vragen',
    titleEn: 'Indirect questions',
    lesson: 41,
    summary: 'In an indirect question the verb goes to the end. Questions with a question word keep it (wat, waar, hoe, wanneer); yes/no questions use "of" (whether).',
    table: {
      head: ['direct', 'indirect'],
      rows: [
        ['Hoe gaat het?', 'Ik vraag me af hoe het gaat.'],
        ['Waar woon je?', 'Kun je me vertellen waar je woont?'],
        ['Kom je morgen?', 'Ik wil weten of je morgen komt.'],
        ['Wat denk je?', 'Ik ben benieuwd wat je denkt.'],
      ],
    },
    points: [
      {
        text: 'Indirect questions are more polite: Weet u ook waar het station is?',
        examples: [
          ['Weet u waar het station is?', 'Do you know where the station is?'],
          ['Ik weet niet of ik kan komen.', "I don't know whether I can come."],
        ],
      },
    ],
    exercises: [
      { type: 'transform', prompt: 'Waar is de bibliotheek?', instruction: 'Start with "Weet u"', answer: 'Weet u waar de bibliotheek is?' },
      { type: 'transform', prompt: 'Kom je zaterdag?', instruction: 'Start with "Ik wil weten"', answer: 'Ik wil weten of je zaterdag komt.' },
      { type: 'transform', prompt: 'Hoe laat begint de les?', instruction: 'Start with "Kun je me vertellen"', answer: 'Kun je me vertellen hoe laat de les begint?' },
      { type: 'mc', prompt: 'Ik weet niet ___ hij komt.', options: ['of', 'als', 'dat of'], answer: 0 },
      { type: 'mc', prompt: 'Weet jij waar mijn sleutels ___?', options: ['zijn', 'zijn ze', 'zij zijn'], answer: 0, explain: 'Verb at the end: …waar mijn sleutels zijn.' },
      { type: 'order', words: ['Ik', 'vraag', 'me', 'af', 'hoe', 'het', 'met', 'je', 'gaat'], en: 'I wonder how you are doing.' },
      { type: 'order', words: ['Weet', 'u', 'hoe', 'laat', 'het', 'is?'], en: 'Do you know what time it is?' },
    ],
  },
  {
    id: 'tenses-overview',
    title: 'Alle tijden op een rij',
    titleEn: 'All tenses together',
    lesson: 42,
    summary: 'You now know the present, perfect, simple past and future, plus modal verbs and the passive. Choose by what you want to say.',
    table: {
      head: ['tense', 'use', 'example'],
      rows: [
        ['present', 'now, habits, near future', 'Ik werk in Utrecht.'],
        ['perfect', 'past (speech), finished', 'Ik heb in Utrecht gewerkt.'],
        ['simple past', 'stories, descriptions', 'Ik werkte toen in Utrecht.'],
        ['past perfect', 'before another past moment', 'Ik had al gegeten.'],
        ['future', 'plans and predictions', 'Ik ga / zal in Utrecht werken.'],
        ['conditional', 'wishes, politeness', 'Ik zou in Utrecht willen werken.'],
      ],
    },
    points: [
      {
        text: 'Signal words help: gisteren / vorig jaar → past; morgen / volgend jaar → future; altijd / vaak → present.',
        examples: [
          ['Gisteren heb ik gewerkt.', 'Yesterday I worked.'],
          ['Volgend jaar ga ik studeren.', 'Next year I am going to study.'],
        ],
      },
    ],
    exercises: [
      { type: 'mc', prompt: 'Gisteren ___ ik naar de markt.', options: ['ging', 'ga', 'zal gaan'], answer: 0 },
      { type: 'mc', prompt: 'Volgend jaar ___ ik een opleiding doen.', options: ['ga', 'ging', 'heb'], answer: 0 },
      { type: 'mc', prompt: 'Ik ___ al drie jaar in Nederland.', options: ['woon', 'woonde', 'zal wonen'], answer: 0 },
      { type: 'mc', prompt: 'Toen ik aankwam, ___ de trein al vertrokken.', options: ['was', 'is', 'werd'], answer: 0 },
      { type: 'transform', prompt: 'Ik leer Nederlands.', instruction: 'Perfect tense', answer: 'Ik heb Nederlands geleerd.' },
      { type: 'transform', prompt: 'Ik leer Nederlands.', instruction: 'Simple past', answer: 'Ik leerde Nederlands.' },
      { type: 'transform', prompt: 'Ik leer Nederlands.', instruction: 'Future with gaan', answer: 'Ik ga Nederlands leren.' },
      { type: 'transform', prompt: 'Ik leer Nederlands.', instruction: 'With "zou … willen"', answer: 'Ik zou Nederlands willen leren.' },
    ],
  },
];
