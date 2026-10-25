export interface TutorScenario {
  id: string;
  unit: number;
  title: string;
  titleEn: string;
  /** Who the AI plays, written for the model. */
  role: string;
  /** What the learner should achieve. */
  goal: string;
  opener: string;
  hints: string[];
}

export const TUTOR_SCENARIOS: TutorScenario[] = [
  {
    id: 'kennismaken',
    unit: 1,
    title: 'Kennismaken in de klas',
    titleEn: 'Meeting a classmate',
    role: 'A friendly classmate in a Dutch course who wants to get to know the learner.',
    goal: 'Tell your name, country, city, family and why you learn Dutch; ask the partner one question back.',
    opener: 'Hoi! Ik ben Sanne. Ik ben nieuw in de groep. Hoe heet jij?',
    hints: ['Ik heet …', 'Ik kom uit …', 'Ik woon in …', 'En jij?'],
  },
  {
    id: 'bakker',
    unit: 1,
    title: 'Bij de bakker',
    titleEn: 'At the bakery',
    role: 'A shop assistant in a Dutch bakery. You sell bread, croissants and cake, ask what they want, give a price in euros and ask how they pay.',
    goal: 'Buy two items, ask the price, and pay by card.',
    opener: 'Goedemorgen! Zegt u het maar.',
    hints: ['Ik wil graag …', 'Hoeveel kost …?', 'Mag ik pinnen?', 'Dank u wel.'],
  },
  {
    id: 'buurman',
    unit: 2,
    title: 'De nieuwe buurman',
    titleEn: 'The new neighbour',
    role: 'A friendly Dutch neighbour (Joost, 60) who meets the learner on the street. You talk about the house, the neighbourhood and the weather.',
    goal: 'Introduce yourself, say where you live, talk about your house and the weather, and agree to have coffee some day.',
    opener: 'Hallo! Wonen jullie sinds kort op nummer zeven? Ik ben Joost, de buurman.',
    hints: ['Ja, we wonen hier sinds …', 'Het huis is …', 'Wat een mooi weer!', 'Leuk, graag!'],
  },
  {
    id: 'weg-vragen',
    unit: 2,
    title: 'De weg vragen',
    titleEn: 'Asking the way',
    role: 'A passer-by in the centre of Utrecht. The learner asks the way to the station or the library. Give simple directions (rechtdoor, linksaf, rechtsaf, de tweede straat).',
    goal: 'Ask the way, check you understand, and thank the person.',
    opener: 'Ja? Kan ik u helpen?',
    hints: ['Waar is …?', 'Is het ver?', 'Dus eerst rechtdoor en dan …?', 'Bedankt!'],
  },
  {
    id: 'huisarts',
    unit: 3,
    title: 'Bellen met de huisarts',
    titleEn: 'Calling the GP',
    role: "A doctor's assistant (assistente) at a GP practice on the phone. Ask the patient's name and date of birth, what the complaint is, how long, and offer an appointment.",
    goal: 'Explain your complaint, answer questions and make an appointment.',
    opener: 'Huisartsenpraktijk De Linde, met Inge. Wat kan ik voor u doen?',
    hints: ['Ik ben ziek. Ik heb …', 'Sinds twee dagen.', 'Mijn geboortedatum is …', 'Kan ik vandaag komen?'],
  },
  {
    id: 'school-gesprek',
    unit: 3,
    title: 'Gesprek met de juf',
    titleEn: "Talking to your child's teacher",
    role: 'A primary school teacher (juf Linda) at a short parent conversation. Your child does well with maths but is quiet in class.',
    goal: 'Ask how your child is doing, react, and ask what you can do at home.',
    opener: 'Fijn dat u er bent. Zullen we beginnen? Uw zoon doet het goed met rekenen.',
    hints: ['Hoe gaat het met …?', 'Wat kan ik thuis doen?', 'Is hij blij in de klas?'],
  },
  {
    id: 'feest',
    unit: 4,
    title: 'Op een verjaardag',
    titleEn: 'At a birthday party',
    role: "A guest at a Dutch birthday party (a colleague's partner). Make small talk: congratulate, ask how the learner knows the host, talk about work and holidays.",
    goal: 'Congratulate, make small talk for a few minutes, and say goodbye politely.',
    opener: 'Hallo! Ik ben Marco. Gefeliciteerd met je collega, hè! Hoe ken jij Petra?',
    hints: ['Gefeliciteerd!', 'Ik ken haar van mijn werk.', 'Wat doe jij?', 'Ik moet nu gaan.'],
  },
  {
    id: 'politie',
    unit: 4,
    title: 'Aangifte doen',
    titleEn: 'Reporting a stolen bike',
    role: 'A police officer at the desk of a police station. Ask when and where the bike was stolen, what it looks like, and for an ID.',
    goal: 'Report your stolen bike: when, where, what it looks like.',
    opener: 'Goedemiddag. Waar kan ik u mee helpen?',
    hints: ['Mijn fiets is gestolen.', 'Gisteren, bij het station.', 'Hij is zwart, met een rode tas.'],
  },
  {
    id: 'sollicitatie',
    unit: 5,
    title: 'Een sollicitatiegesprek',
    titleEn: 'A job interview',
    role: 'A manager at a supermarket interviewing the learner for a part-time job. Ask about experience, availability and why they want the job.',
    goal: 'Tell about your experience, when you can work, and why you want the job; ask one question about the job.',
    opener: 'Goedemiddag, welkom! Fijn dat u wilt komen praten. Kunt u iets over uzelf vertellen?',
    hints: ['Ik heb ervaring met …', 'Ik kan werken op …', 'Ik wil graag …', 'Hoeveel uur per week is het?'],
  },
  {
    id: 'gemeente',
    unit: 6,
    title: 'Bij de gemeente',
    titleEn: 'At the town hall',
    role: 'A civil servant at the municipality desk (burgerzaken). The learner moves house and must register a new address; ask for ID, new address and moving date.',
    goal: 'Register your move: give your new address, date and show ID.',
    opener: 'Goedemorgen. U heeft een afspraak? Wat kan ik voor u doen?',
    hints: ['Ik ga verhuizen.', 'Mijn nieuwe adres is …', 'Vanaf één juni.', 'Hier is mijn paspoort.'],
  },
];

export function getScenario(id: string): TutorScenario | undefined {
  return TUTOR_SCENARIOS.find((s) => s.id === id);
}
