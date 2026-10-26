/* Official and well-established sources behind the bonus rounds. Links were checked on 2026-10-26. */

export interface Source {
  id: string;
  label: string;
  publisher: string;
  url: string;
  /** What the learner can do there. */
  note: string;
}

const LIST: Source[] = [
  { id: 'duo-oefenen', label: 'Officiële oefenexamens A2', publisher: 'DUO / Inburgeren.nl', url: 'https://www.inburgeren.nl/examen-doen/oefenen.jsp', note: 'The real practice exams for Lezen, Luisteren, Schrijven, Spreken and KNM.' },
  { id: 'duo-spreken-2025', label: 'Examen Spreken A2 veranderd (1 maart 2025)', publisher: 'DUO / Inburgeren.nl', url: 'https://www.inburgeren.nl/nieuwsberichten/artikel.jsp?cid=tcm:94-215443-16', note: 'Since March 2025 the speaking exam only has recorded answers — no multiple choice.' },
  { id: 'knm-2025', label: 'Inburgeringsexamen vernieuwd: zelfbeschikking en holocaust', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/actueel/nieuws/2025/06/30/inburgeringsexamen-vernieuwd-extra-aandacht-voor-zelfbeschikking-vrouwen-en-kennis-holocaust', note: 'New KNM end terms from 1 July 2025: more knowledge questions, extra attention for women’s self-determination and the Holocaust.' },
  { id: 'tudelft-mooc', label: 'Online beginners course (Delft method)', publisher: 'TU Delft', url: 'https://www.tudelft.nl/en/tpm/itav/education/dutch-courses/dutch-courses/beginners-courses/online-beginners-course', note: 'Free 6-week self-study course by the makers of the Delft method.' },
  { id: 'naar-nederland', label: 'Naar Nederland', publisher: 'Rijksoverheid', url: 'https://www.naarnederland.nl/', note: 'Free government course with films about life in the Netherlands, in many languages.' },
  { id: 'jeugdjournaal', label: 'NOS Jeugdjournaal', publisher: 'NOS', url: 'https://jeugdjournaal.nl/', note: 'Daily news in simple Dutch, with video — great listening practice.' },
  { id: 'e-ans', label: 'e-ANS: Algemene Nederlandse Spraakkunst', publisher: 'Instituut voor de Nederlandse Taal', url: 'https://e-ans.ivdnt.org/', note: 'The reference grammar of Dutch, for when you want the full rule.' },
  { id: 'voedingscentrum', label: 'De Schijf van Vijf', publisher: 'Voedingscentrum', url: 'https://www.voedingscentrum.nl/nl/gezond-eten-met-de-schijf-van-vijf.aspx', note: 'The official Dutch guide to healthy eating.' },
  { id: 'annefrank', label: 'Anne Frank Huis', publisher: 'Anne Frank Stichting', url: 'https://www.annefrank.org/nl/', note: 'Anne Frank’s story and the persecution of Jews in the Netherlands.' },
  { id: '4en5mei', label: 'Nationaal Comité 4 en 5 mei', publisher: 'Nationaal Comité 4 en 5 mei', url: 'https://www.4en5mei.nl/', note: 'Remembrance Day and Liberation Day: what and why.' },
  { id: 'westerbork', label: 'Herinneringscentrum Kamp Westerbork', publisher: 'Kamp Westerbork', url: 'https://www.kampwesterbork.nl/', note: 'The transit camp from which Dutch Jews were deported.' },
  { id: 'veilig-thuis', label: 'Veilig Thuis', publisher: 'Veilig Thuis', url: 'https://veiligthuis.nl/', note: 'Free help with domestic violence and abuse: 0800-2000.' },
  { id: 'huwelijksdwang', label: 'Huwelijksdwang', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/huwelijksdwang', note: 'Forced marriage is a crime in the Netherlands; where to get help.' },
  { id: 'trouwen', label: 'Trouwen, samenlevingscontract en partnerschap', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/trouwen-samenlevingscontract-en-geregistreerd-partnerschap', note: 'Marriage, registered partnership and cohabitation agreements explained.' },
  { id: 'emancipatie', label: 'Emancipatie', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/emancipatie', note: 'Equal rights for women and men, and for LGBTI people.' },
  { id: 'discriminatie', label: 'Discriminatie.nl', publisher: 'Antidiscriminatievoorzieningen', url: 'https://www.discriminatie.nl/', note: 'Report discrimination and get free advice.' },
  { id: 'politie', label: 'Politie', publisher: 'Politie', url: 'https://www.politie.nl/', note: 'Report a crime online, find your local police officer (wijkagent).' },
  { id: 'ns', label: 'NS — reizen met de trein', publisher: 'NS', url: 'https://www.ns.nl/', note: 'Train timetables, tickets and delays.' },
  { id: 'ov-chipkaart', label: 'OV-chipkaart', publisher: 'Translink', url: 'https://www.ov-chipkaart.nl/', note: 'How checking in and out works on public transport.' },
  { id: 'toeslagen', label: 'Toeslagen', publisher: 'Belastingdienst', url: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/toeslagen', note: 'Rent, healthcare and childcare allowances.' },
  { id: 'kiesraad', label: 'Kiesraad', publisher: 'Kiesraad', url: 'https://www.kiesraad.nl/', note: 'How elections work and who may vote.' },
  { id: 'verkiezingen', label: 'Verkiezingen', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/verkiezingen', note: 'Election types and how to vote.' },
  { id: 'digid', label: 'DigiD', publisher: 'Logius', url: 'https://www.digid.nl/', note: 'Apply for and use your DigiD safely.' },
  { id: 'milieucentraal', label: 'Milieu Centraal', publisher: 'Milieu Centraal', url: 'https://www.milieucentraal.nl/', note: 'Practical tips for saving energy and separating waste.' },
  { id: 'afval', label: 'Afval', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/afval', note: 'Waste separation and recycling in the Netherlands.' },
  { id: 'energie', label: 'Energie thuis', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/energie-thuis', note: 'Saving energy at home and the costs of energy.' },
  { id: 'thuisarts', label: 'Thuisarts.nl', publisher: 'Nederlands Huisartsen Genootschap', url: 'https://www.thuisarts.nl/', note: 'GPs’ own information about health complaints, in plain Dutch.' },
  { id: 'huisartsenpost', label: 'Huisartsenpost', publisher: 'InEen', url: 'https://www.huisartsenpost.nl/', note: 'Find the out-of-hours GP service near you.' },
  { id: 'zorgverzekering', label: 'Zorgverzekering', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/zorgverzekering', note: 'Compulsory health insurance and the deductible.' },
  { id: 'vaccinaties', label: 'Vaccinaties', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/vaccinaties', note: 'The national vaccination programme for children.' },
  { id: 'juridisch-loket', label: 'Het Juridisch Loket', publisher: 'Het Juridisch Loket', url: 'https://www.juridischloket.nl/', note: 'Free legal advice.' },
  { id: 'werk-nl', label: 'Werk.nl', publisher: 'UWV', url: 'https://www.werk.nl/', note: 'Vacancies and help finding work.' },
  { id: 'minimumloon', label: 'Minimumloon', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/minimumloon', note: 'The current minimum wage.' },
  { id: 'arbeidsovereenkomst', label: 'Arbeidsovereenkomst en cao', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/arbeidsovereenkomst-en-cao', note: 'What is in an employment contract.' },
  { id: 'huurcommissie', label: 'Huurcommissie', publisher: 'Huurcommissie', url: 'https://www.huurcommissie.nl/', note: 'Disputes about rent and maintenance.' },
  { id: 'huurwoning', label: 'Huurwoning zoeken', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/huurwoning-zoeken', note: 'How to find a rented home.' },
  { id: 'vrijwilligerswerk', label: 'Vrijwilligerswerk.nl', publisher: 'NOV', url: 'https://www.vrijwilligerswerk.nl/', note: 'Find volunteer work near you.' },
  { id: 'provincies', label: 'Provincies', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/provincies', note: 'What the twelve provinces do.' },
  { id: 'gemeenten', label: 'Gemeenten', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/gemeenten', note: 'What your municipality does.' },
  { id: 'schulden', label: 'Schulden', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/schulden', note: 'Help with debts.' },
  { id: 'geldfit', label: 'Geldfit', publisher: 'Geldfit', url: 'https://www.geldfit.nl/', note: 'Free, anonymous check of your finances and help with debts.' },
  { id: 'leerplicht', label: 'Leerplicht', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/leerplicht', note: 'Compulsory education and leave from school.' },
  { id: 'basisonderwijs', label: 'Basisonderwijs', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/basisonderwijs', note: 'How primary school works.' },
  { id: 'kinderopvangtoeslag', label: 'Kinderopvangtoeslag', publisher: 'Belastingdienst', url: 'https://www.kinderopvangtoeslag.nl/', note: 'Allowance for childcare costs.' },
  { id: 'paspoort', label: 'Paspoort en identiteitskaart', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/paspoort-en-identiteitskaart', note: 'Applying for a passport or ID card.' },
  { id: 'ind', label: 'IND', publisher: 'Immigratie- en Naturalisatiedienst', url: 'https://www.ind.nl/', note: 'Residence permits and naturalisation.' },
  { id: 'duo', label: 'DUO', publisher: 'Dienst Uitvoering Onderwijs', url: 'https://www.duo.nl/particulier/', note: 'Student finance and the integration exam.' },
  { id: 'water', label: 'Water', publisher: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/onderwerpen/water', note: 'How the Netherlands protects itself against water.' },
  { id: 'knmi', label: 'KNMI — weer en klimaat', publisher: 'KNMI', url: 'https://www.knmi.nl/', note: 'Official weather forecasts and warnings.' },
  { id: 'buienradar', label: 'Buienradar', publisher: 'Buienradar', url: 'https://www.buienradar.nl/', note: 'Rain radar: when will it rain where you are?' },
  { id: 'postnl', label: 'PostNL', publisher: 'PostNL', url: 'https://www.postnl.nl/', note: 'Track and collect parcels.' },
  { id: 'bibliotheek', label: 'De Bibliotheek', publisher: 'Koninklijke Bibliotheek', url: 'https://www.bibliotheek.nl/', note: 'Libraries: free language cafés and easy-to-read books.' },
  { id: 'rijksmuseum', label: 'Rijksmuseum', publisher: 'Rijksmuseum', url: 'https://www.rijksmuseum.nl/', note: 'Dutch art and history.' },
  { id: 'nationaal-archief', label: 'Nationaal Archief', publisher: 'Nationaal Archief', url: 'https://www.nationaalarchief.nl/', note: 'Dutch history from original documents.' },
  { id: 'consumentenbond', label: 'Consumentenbond', publisher: 'Consumentenbond', url: 'https://www.consumentenbond.nl/', note: 'Your rights when you buy, return or exchange things.' },
  { id: 'government-integration', label: 'Integration in the Netherlands', publisher: 'Government.nl', url: 'https://www.government.nl/topics/integration-in-the-netherlands', note: 'The integration rules in English.' },
];

export const SOURCES: Record<string, Source> = Object.fromEntries(LIST.map((s) => [s.id, s]));
export const ALL_SOURCES = LIST;
