import type { SpeakingTask } from '../schema';

/* Spreken: the exam shows a situation and asks a question. Short answers (one or two sentences)
   and longer answers (tell about yourself, give an opinion). Units 1–6 practice, unit 7 mock. */

type Row = [string, number, 'short' | 'long', string, string, string, string[]];

const ROWS: Row[] = [
  ['s1-naam', 1, 'short', 'Je bent op een nieuwe cursus. De docent vraagt:', 'Hoe heet u en waar komt u vandaan?', 'Ik heet Ana Silva en ik kom uit Brazilië.', ['heet', 'kom uit']],
  ['s1-wonen', 1, 'short', 'Een buurvrouw vraagt:', 'Waar woont u?', 'Ik woon in de Slotlaan, op nummer acht, in Zeist.', ['woon', 'in']],
  ['s1-dag', 1, 'long', 'Je vertelt over je dag.', 'Wat doet u op een normale dag? Vertel van de ochtend tot de avond.', "Ik sta om zeven uur op. Ik eet brood en ik drink koffie. Daarna ga ik met de fiets naar mijn werk. 's Avonds kook ik en kijk ik televisie.", ['ochtend', 'daarna', "'s avonds"]],
  ['s1-winkel', 1, 'short', 'Je bent in de supermarkt. Je zoekt melk. Je vraagt het aan een medewerker.', 'Wat zegt u?', 'Pardon, waar staat de melk?', ['waar', 'melk']],
  ['s1-kassa', 1, 'short', 'Je bent bij de kassa. De medewerker vraagt: "Wilt u de bon?"', 'Wat zegt u?', 'Nee, dank u wel.', ['dank u']],
  ['s1-leren', 1, 'long', 'Je praat met een klasgenoot over Nederlands leren.', 'Hoe leert u Nederlands? Wat vindt u makkelijk en wat moeilijk?', 'Ik leer elke dag een half uur. Ik luister naar teksten en ik herhaal de woorden. Lezen vind ik makkelijk, maar spreken vind ik moeilijk.', ['leer', 'makkelijk', 'moeilijk']],
  ['s2-eten', 2, 'long', 'Een collega vraagt naar eten.', 'Wat eet u graag? Wat eet men in uw land?', 'Ik eet graag rijst met kip en groenten. In mijn land eten we vaak warm, ook tussen de middag.', ['eet', 'graag']],
  ['s2-weg', 2, 'short', 'Je bent in de stad. Je zoekt het station.', 'Wat vraagt u aan een voorbijganger?', 'Pardon, weet u waar het station is?', ['waar', 'station']],
  ['s2-reizen', 2, 'short', 'Een collega vraagt:', 'Hoe komt u naar uw werk?', 'Ik kom met de fiets. Het is twintig minuten.', ['met de']],
  ['s2-seizoen', 2, 'long', 'Je praat over het weer.', 'Welk seizoen vindt u het mooist? Waarom?', 'Ik vind de lente het mooist, want dan komen de bloemen en het wordt warmer. De winter vind ik te koud en te donker.', ['vind', 'want']],
  ['s2-huis', 2, 'long', 'Een vriend vraagt naar je huis.', 'Hoe woont u? Vertel over uw huis.', 'Ik woon in een appartement met twee slaapkamers. Er is een kleine keuken en een balkon. Ik huur het huis.', ['woon', 'slaapkamers']],
  ['s2-familie', 2, 'long', 'Je laat een foto van je familie zien.', 'Vertel over uw familie.', 'Ik heb een broer en twee zussen. Mijn ouders wonen in Turkije. Mijn broer woont ook in Nederland, in Rotterdam.', ['broer', 'zus', 'ouders']],
  ['s3-huisarts', 3, 'short', 'Je belt de huisarts. Je hebt al drie dagen keelpijn.', 'Wat zegt u tegen de assistente?', 'Goedemorgen. Ik heb al drie dagen keelpijn. Kan ik vandaag langskomen?', ['pijn', 'afspraak', 'langskomen']],
  ['s3-pakje', 3, 'short', 'Je buurman heeft een pakket voor jou aangenomen.', 'Wat zegt u?', 'Dank u wel dat u mijn pakket heeft aangenomen!', ['dank']],
  ['s3-school', 3, 'long', 'Een ouder vraagt naar school in jouw land.', 'Hoe is de school in uw land? Wat is anders dan in Nederland?', 'In mijn land gaan kinderen met zes jaar naar school. De leraren zijn streng. In Nederland spelen de kinderen meer.', ['school', 'anders']],
  ['s3-huishouden', 3, 'long', 'Je praat over het huishouden.', 'Wie doet bij u thuis het huishouden? Wat doet u zelf?', 'Mijn man en ik doen het samen. Ik kook en hij doet de afwas. In het weekend maken we samen het huis schoon.', ['koken', 'schoonmaken']],
  ['s3-bank', 3, 'short', 'Je pinpas werkt niet bij de kassa.', 'Wat zegt u tegen de medewerker?', 'Sorry, mijn pas werkt niet. Kan ik contant betalen?', ['pas', 'contant']],
  ['s3-uitje', 3, 'long', 'Een vriend vraagt naar je weekend.', 'Wat heeft u vorig weekend gedaan?', 'Vorig weekend ben ik met mijn kinderen naar de dierentuin geweest. We hebben veel dieren gezien. Het was een leuke dag.', ['ben', 'heb', 'gedaan']],
  ['s4-feest', 4, 'short', 'Je collega is jarig.', 'Wat zegt u?', 'Gefeliciteerd met je verjaardag!', ['gefeliciteerd']],
  ['s4-feestdag', 4, 'long', 'Je praat over feestdagen.', 'Welk feest is belangrijk in uw land? Wat doet u dan?', 'Het Suikerfeest is belangrijk. We bezoeken familie, we eten samen en de kinderen krijgen cadeautjes.', ['feest', 'familie']],
  ['s4-politie', 4, 'short', 'Je ziet een ongeluk op straat. Je belt 112.', 'Wat zegt u?', 'Er is een ongeluk gebeurd in de Kerkstraat. Er is een man gewond. Kunt u snel komen?', ['ongeluk', 'waar']],
  ['s4-trouwen', 4, 'long', 'Je praat over trouwen.', 'Hoe is een bruiloft in uw land?', 'In mijn land is een bruiloft heel groot. Er komen wel driehonderd gasten. Het feest duurt twee dagen.', ['bruiloft', 'gasten']],
  ['s4-nederland', 4, 'long', 'Iemand vraagt naar Nederland.', 'Wat vindt u mooi aan Nederland? En wat niet?', 'Ik vind de natuur en de grachten mooi. Ik vind het weer niet mooi, want het regent veel.', ['vind', 'mooi']],
  ['s4-buren', 4, 'short', 'De muziek van je buren is te hard. Het is elf uur \'s avonds.', 'Wat zegt u tegen uw buren?', 'Sorry, de muziek is erg hard. Mijn kinderen slapen. Kunt u het zachter zetten?', ['zachter', 'slapen']],
  ['s5-werk', 5, 'long', 'In een sollicitatiegesprek.', 'Welk werk heeft u gedaan? Wat wilt u in Nederland doen?', 'In mijn land was ik kok in een restaurant. In Nederland wil ik ook in de horeca werken. Later wil ik een eigen restaurant.', ['werk', 'wil']],
  ['s5-ziek', 5, 'short', 'Je bent ziek. Je belt je werk.', 'Wat zegt u tegen uw leidinggevende?', 'Goedemorgen, met Omar. Ik ben ziek. Ik kan vandaag niet komen werken.', ['ziek', 'niet komen']],
  ['s5-vrijetijd', 5, 'long', 'Een collega vraagt naar je hobby\'s.', 'Wat doet u in uw vrije tijd?', 'In mijn vrije tijd ga ik graag zwemmen. Ook lees ik veel en ik kijk films met mijn vrienden.', ['vrije tijd', 'graag']],
  ['s5-gezond', 5, 'long', 'Je praat over gezondheid.', 'Wat doet u om gezond te blijven?', 'Ik eet veel groente en fruit. Ik fiets elke dag naar mijn werk. Ik rook niet.', ['gezond', 'elke dag']],
  ['s5-gemeente', 5, 'short', 'Je bent bij de gemeente. Je wilt een nieuw paspoort.', 'Wat zegt u aan de balie?', 'Goedemorgen. Ik wil graag een nieuw paspoort aanvragen.', ['paspoort', 'aanvragen']],
  ['s5-kinderen', 5, 'long', 'Je praat met een ouder op het schoolplein.', 'Wat is belangrijk voor kinderen, vindt u?', 'Ik vind het belangrijk dat kinderen veel buiten spelen. Ook moeten ze goed naar school gaan en genoeg slapen.', ['belangrijk', 'kinderen']],
  ['s6-gemeente', 6, 'short', 'Je gaat verhuizen. Je belt de gemeente.', 'Wat zegt u?', 'Goedemorgen. Ik ga verhuizen en ik wil mijn nieuwe adres doorgeven.', ['verhuizen', 'adres']],
  ['s6-klimaat', 6, 'long', 'Je praat over het milieu.', 'Wat doet u voor het milieu?', 'Ik scheid mijn afval: plastic, papier en glas. Ik ga met de fiets en ik douche kort.', ['afval', 'fiets']],
  ['s6-politiek', 6, 'long', 'Je praat over politiek.', 'Vindt u stemmen belangrijk? Waarom?', 'Ja, ik vind stemmen belangrijk, want dan kan ik meebeslissen over mijn stad. Ik ga altijd stemmen.', ['belangrijk', 'want']],
  ['s6-leven', 6, 'long', 'Iemand vraagt naar je leven in Nederland.', 'Hoe lang woont u in Nederland en hoe bevalt het?', 'Ik woon hier nu twee jaar. Het bevalt goed. Ik heb werk en aardige buren. Alleen het weer vind ik moeilijk.', ['woon', 'jaar']],
  ['s6-toekomst', 6, 'long', 'Je praat over je plannen.', 'Wat zijn uw plannen voor de toekomst?', 'Eerst wil ik mijn examen halen. Daarna wil ik een opleiding doen en een goede baan vinden.', ['wil', 'daarna']],
  ['s6-hulp', 6, 'short', 'Een oudere buurvrouw draagt zware tassen.', 'Wat zegt u?', 'Kan ik u helpen met de tassen?', ['helpen']],
  ['m-s-1', 7, 'short', 'Je bent in de trein. Je wilt weten hoe laat de trein in Utrecht aankomt. Je vraagt het aan een conducteur.', 'Wat zegt u?', 'Pardon, hoe laat komt de trein in Utrecht aan?', ['hoe laat', 'aan']],
  ['m-s-2', 7, 'short', 'Je bent in een winkel. Je wilt een broek passen.', 'Wat vraagt u?', 'Mag ik deze broek passen? Waar is de paskamer?', ['passen']],
  ['m-s-3', 7, 'long', 'Je praat met een collega.', 'Wat heeft u gisteren gedaan?', 'Gisteren heb ik gewerkt tot vier uur. Daarna heb ik boodschappen gedaan en heb ik gekookt.', ['heb', 'gedaan']],
  ['m-s-4', 7, 'long', 'Je praat over wonen.', 'Woont u liever in een stad of in een dorp? Waarom?', 'Ik woon liever in een stad, want daar zijn veel winkels en er is werk. Een dorp vind ik te rustig.', ['liever', 'want']],
  ['m-s-5', 7, 'short', 'Je hebt een afspraak bij de tandarts, maar je bent ziek.', 'Wat zegt u aan de telefoon?', 'Goedemorgen, ik heb vandaag een afspraak, maar ik ben ziek. Kan ik een nieuwe afspraak maken?', ['afspraak', 'ziek']],
  ['m-s-6', 7, 'long', 'Je praat over vervoer.', 'Hoe reist u het liefst? Waarom?', 'Ik reis het liefst met de fiets, want dat is gezond en goedkoop. Voor lange reizen neem ik de trein.', ['liefst', 'want']],
];

export const SPEAKING: SpeakingTask[] = ROWS.map(([id, unit, kind, situation, prompt, model, keywords]) => ({ id, unit, kind, situation, prompt, model, keywords }));
