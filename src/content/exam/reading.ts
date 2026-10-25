import { mc } from '../dsl';
import type { ReadingItem } from '../schema';

/* Lezen: short real-life texts with multiple-choice questions, as in the A2 exam.
   Units 1–6 are for practice; unit 7 items are reserved for the mock exams. */

export const READING: ReadingItem[] = [
  // ---------- Unit 1 ----------
  {
    id: 'r1-taalcafe',
    unit: 1,
    title: 'Taalcafé in de bibliotheek',
    genre: 'notice',
    body: `TAALCAFÉ
Wilt u Nederlands oefenen? Kom naar het Taalcafé!
Waar: Bibliotheek Zeist, Markt 2
Wanneer: elke dinsdag van 14.00 tot 15.30 uur
U praat met vrijwilligers over gewone dingen: uw dag, het weer, boodschappen doen.
Het Taalcafé is gratis. U hoeft zich niet aan te melden.
Koffie en thee staan klaar!`,
    questions: [
      mc('Wat kunt u doen in het Taalcafé?', 'Nederlands praten met vrijwilligers', 'Boeken kopen', 'Een cursus Engels volgen'),
      mc('Hoe laat stopt het Taalcafé?', 'Om half vier', 'Om twee uur', 'Om vier uur'),
      mc('Wat moet u doen voordat u komt?', 'Niets, u kunt gewoon komen', 'U moet zich aanmelden', 'U moet betalen'),
    ],
  },
  {
    id: 'r1-rooster',
    unit: 1,
    title: 'Lesrooster',
    genre: 'schedule',
    body: `Taalschool De Brug — Rooster groep A1
Maandag     09.00 – 12.00   lokaal 3   docent: Marieke
Woensdag    09.00 – 12.00   lokaal 3   docent: Marieke
Donderdag   18.30 – 20.30   lokaal 7   docent: Peter
Let op: op donderdag 14 november is er geen les.
Bent u ziek? Bel dan voor 9.00 uur naar 030 – 123 45 67.`,
    questions: [
      mc('Op welke dag is de les in de avond?', 'Op donderdag', 'Op maandag', 'Op woensdag'),
      mc('Wie geeft les op woensdag?', 'Marieke', 'Peter', 'Dat staat er niet'),
      mc('U bent ziek. Wat moet u doen?', 'Voor negen uur bellen', 'Een e-mail sturen', 'Naar lokaal 7 gaan'),
    ],
  },
  {
    id: 'r1-supermarkt',
    unit: 1,
    title: 'Openingstijden supermarkt',
    genre: 'notice',
    body: `Supermarkt Vers & Voordelig
Openingstijden
maandag t/m zaterdag: 08.00 – 21.00 uur
zondag: 12.00 – 18.00 uur
Op Tweede Kerstdag zijn wij gesloten.
U kunt bij ons alleen pinnen. Contant betalen is niet mogelijk.`,
    questions: [
      mc('Hoe laat gaat de supermarkt op zondag open?', 'Om twaalf uur', 'Om acht uur', 'Om zes uur'),
      mc('Hoe kunt u betalen?', 'Alleen met de pinpas', 'Alleen contant', 'Contant of met de pinpas'),
      mc('Wanneer is de supermarkt dicht?', 'Op Tweede Kerstdag', 'Op zaterdag', 'Op maandagavond'),
    ],
  },
  {
    id: 'r1-formulier',
    unit: 1,
    title: 'Inschrijfformulier sportclub',
    genre: 'form',
    body: `Inschrijfformulier — Sportclub Vitesse Zeist
Voornaam: Karim
Achternaam: El Amrani
Geboortedatum: 04-09-1992
Adres: Laan van Vollenhove 21
Postcode en woonplaats: 3706 AB Zeist
Telefoon: 06 – 48 22 19 03
Sport: zwemmen
Ik wil sporten op: woensdagavond en zaterdagochtend`,
    questions: [
      mc('Wat is de achternaam van deze persoon?', 'El Amrani', 'Karim', 'Vitesse'),
      mc('Welke sport wil hij doen?', 'Zwemmen', 'Voetballen', 'Fietsen'),
      mc('Wanneer is hij geboren?', 'Op 4 september 1992', 'Op 9 april 1992', 'Op 21 juni 1992'),
    ],
  },
  {
    id: 'r1-sms',
    unit: 1,
    title: 'Bericht van een klasgenoot',
    genre: 'message',
    body: `Hoi Ana! Ik ben morgen niet in de les, want mijn dochter is ziek. Kun jij het huiswerk voor mij opschrijven? En wil je de nieuwe woorden ook een foto sturen? Dank je wel! Groetjes, Mei`,
    questions: [
      mc('Waarom komt Mei morgen niet naar de les?', 'Haar dochter is ziek', 'Ze is zelf ziek', 'Ze moet werken'),
      mc('Wat vraagt Mei aan Ana?', 'Het huiswerk opschrijven', 'Haar dochter halen', 'De docent bellen'),
    ],
  },

  // ---------- Unit 2 ----------
  {
    id: 'r2-recept',
    unit: 2,
    title: 'Recept: snelle groentesoep',
    genre: 'instructions',
    body: `Snelle groentesoep (4 personen)
Je hebt nodig: 1 ui, 2 wortels, 1 prei, 3 aardappelen, 1 liter water, 1 bouillonblokje.
1. Snijd de groente in kleine stukjes.
2. Doe het water en het bouillonblokje in een pan en laat het koken.
3. Doe de groente in de pan. Laat de soep 20 minuten koken.
4. Eet de soep met een stuk brood. Eet smakelijk!`,
    questions: [
      mc('Voor hoeveel mensen is dit recept?', 'Voor vier personen', 'Voor één persoon', 'Voor twintig personen'),
      mc('Wat doe je eerst?', 'De groente in stukjes snijden', 'De soep eten', 'Het brood kopen'),
      mc('Hoe lang moet de soep koken?', 'Twintig minuten', 'Een uur', 'Vijf minuten'),
    ],
  },
  {
    id: 'r2-ns',
    unit: 2,
    title: 'Bericht op het station',
    genre: 'notice',
    body: `Let op! Werkzaamheden aan het spoor
Zaterdag 12 en zondag 13 oktober rijden er geen treinen tussen Utrecht Centraal en Amersfoort.
Er rijden wel bussen. De bussen vertrekken bij de uitgang Jaarbeursplein.
De reis duurt ongeveer 30 minuten langer.
Plan uw reis in de app.`,
    questions: [
      mc('Wat is het probleem op 12 en 13 oktober?', 'Er rijden geen treinen tussen Utrecht en Amersfoort', 'Het station is dicht', 'De bussen rijden niet'),
      mc('Waar vertrekken de bussen?', 'Bij de uitgang Jaarbeursplein', 'In Amersfoort', 'Op perron 12'),
      mc('Wat is waar?', 'De reis duurt langer', 'De reis is gratis', 'De reis duurt korter'),
    ],
  },
  {
    id: 'r2-weer',
    unit: 2,
    title: 'Het weerbericht',
    genre: 'article',
    body: `Het weer voor morgen
In de ochtend is het in het hele land bewolkt. In het westen valt er wat regen.
In de middag schijnt de zon in het oosten en zuiden. Het wordt 16 graden.
Langs de kust waait het hard.
Overmorgen wordt het kouder: maximaal 11 graden, met veel regen.`,
    questions: [
      mc('Waar regent het morgenochtend?', 'In het westen', 'In het oosten', 'In het zuiden'),
      mc('Hoe warm wordt het morgen?', '16 graden', '11 graden', '6 graden'),
      mc('Hoe is het weer overmorgen?', 'Kouder met veel regen', 'Warm en zonnig', 'Hetzelfde als morgen'),
    ],
  },
  {
    id: 'r2-kamer',
    unit: 2,
    title: 'Advertentie: kamer te huur',
    genre: 'ad',
    body: `KAMER TE HUUR in Utrecht-Oost
Gemeubileerde kamer van 14 m² in een gezellig studentenhuis.
Gedeelde keuken, badkamer en wc met 3 huisgenoten.
Huur: € 520 per maand, inclusief gas, water, licht en internet.
Beschikbaar vanaf 1 maart. Geen huisdieren. Niet roken.
Interesse? Mail naar kamer.oost@mail.nl`,
    questions: [
      mc('Hoeveel mensen wonen er nog meer in het huis?', 'Drie', 'Veertien', 'Eén'),
      mc('Wat zit er in de huur van € 520?', 'Gas, water, licht en internet', 'Alleen de kamer', 'De meubels en een fiets'),
      mc('Wat mag niet in deze kamer?', 'Roken', 'Koken', 'Internet gebruiken'),
    ],
  },
  {
    id: 'r2-uitnodiging',
    unit: 2,
    title: 'Uitnodiging verjaardag',
    genre: 'message',
    body: `Lieve buren,
Op zaterdag 8 juni word ik 40 jaar! Dat wil ik graag met jullie vieren.
Jullie zijn welkom vanaf 16.00 uur in onze tuin, Kerkstraat 9.
Er is eten en drinken. Neem gerust jullie kinderen mee.
Kunnen jullie voor 1 juni laten weten of jullie komen?
Groetjes, Petra`,
    questions: [
      mc('Waarom geeft Petra een feest?', 'Ze wordt 40 jaar', 'Ze gaat verhuizen', 'Ze gaat trouwen'),
      mc('Waar is het feest?', 'In de tuin van Petra', 'In een restaurant', 'Op school'),
      mc('Wat moeten de buren voor 1 juni doen?', 'Laten weten of ze komen', 'Eten meenemen', 'Een cadeau kopen'),
    ],
  },

  // ---------- Unit 3 ----------
  {
    id: 'r3-pakket',
    unit: 3,
    title: 'Briefje van de bezorger',
    genre: 'notice',
    body: `Helaas, wij hebben u niet thuis getroffen.
Uw pakket is afgegeven bij uw buren op nummer 17.
Was dat niet mogelijk? Dan kunt u uw pakket vanaf morgen 10.00 uur ophalen bij het PostNL-punt in de Primera, Dorpsstraat 4.
Neem dit briefje en uw identiteitsbewijs mee.
Uw pakket blijft 7 dagen liggen.`,
    questions: [
      mc('Waar is het pakket nu waarschijnlijk?', 'Bij de buren op nummer 17', 'Bij de post in Amsterdam', 'Weer terug bij de winkel'),
      mc('Wat moet u meenemen naar het PostNL-punt?', 'Dit briefje en uw identiteitsbewijs', 'Alleen geld', 'Uw bankpas'),
      mc('Hoe lang kunt u het pakket ophalen?', 'Zeven dagen', 'Eén dag', 'Een maand'),
    ],
  },
  {
    id: 'r3-school',
    unit: 3,
    title: 'Nieuwsbrief basisschool',
    genre: 'letter',
    body: `Nieuwsbrief OBS De Regenboog — november
Beste ouders,
Op woensdag 20 november zijn alle kinderen om 12.00 uur vrij, want de leerkrachten hebben een studiemiddag.
Op vrijdag 29 november is er een oudergesprek over het rapport. U krijgt een uitnodiging via de app.
Denk eraan: gymles is op dinsdag. Geef uw kind gymschoenen mee.
Met vriendelijke groet, het team van De Regenboog`,
    questions: [
      mc('Waarom zijn de kinderen op 20 november om 12 uur vrij?', 'De leerkrachten hebben een studiemiddag', 'Het is vakantie', 'De school is ziek'),
      mc('Hoe krijgt u de uitnodiging voor het oudergesprek?', 'Via de app', 'Per brief', 'Via de telefoon'),
      mc('Wat moet uw kind op dinsdag meenemen?', 'Gymschoenen', 'Het rapport', 'Een lunch'),
    ],
  },
  {
    id: 'r3-huisarts',
    unit: 3,
    title: 'Huisartsenpraktijk De Linde',
    genre: 'notice',
    body: `Huisartsenpraktijk De Linde
Afspraak maken: bel 's ochtends tussen 8.00 en 10.00 uur: 030 – 765 43 21.
Herhaalrecepten: bestel via de website of de receptenlijn. Ze zijn na 2 werkdagen klaar bij de apotheek.
Spoed? Bel altijd direct 030 – 765 43 22.
In de avond, de nacht en het weekend belt u de huisartsenpost: 0900 – 450 12 12.
Bij levensgevaar: bel 112.`,
    questions: [
      mc('Wanneer kunt u bellen voor een afspraak?', "'s Ochtends tussen 8 en 10 uur", 'De hele dag', "'s Avonds"),
      mc('Het is zaterdag en uw kind heeft hoge koorts. Wie belt u?', 'De huisartsenpost', 'De praktijk De Linde', 'De apotheek'),
      mc('Wanneer is een herhaalrecept klaar?', 'Na twee werkdagen', 'Meteen', 'Na een week'),
    ],
  },
  {
    id: 'r3-bank',
    unit: 3,
    title: 'Bericht van de bank',
    genre: 'email',
    body: `Beste klant,
Uw nieuwe bankpas is onderweg. U ontvangt de pas binnen 5 werkdagen per post.
Uw pincode krijgt u in een aparte brief.
Let op: de bank vraagt nooit om uw pincode via e-mail, sms of telefoon.
Krijgt u zo'n bericht? Reageer dan niet en bel ons: 020 – 555 66 77.
Met vriendelijke groet, Klantenservice`,
    questions: [
      mc('Hoe krijgt u de nieuwe bankpas?', 'Per post', 'Via e-mail', 'Bij de bank zelf'),
      mc('Wat doet de bank nooit?', 'Uw pincode vragen per e-mail of telefoon', 'Een brief sturen', 'Een nieuwe pas sturen'),
      mc('Iemand vraagt per sms om uw pincode. Wat doet u?', 'Niet reageren en de bank bellen', 'De pincode sturen', 'Een nieuwe pas aanvragen'),
    ],
  },
  {
    id: 'r3-dagje',
    unit: 3,
    title: 'Dierenpark Amersfoort',
    genre: 'ad',
    body: `Dagje uit? Kom naar Dierenpark Amersfoort!
Open: elke dag van 9.00 tot 18.00 uur (november t/m februari tot 17.00 uur)
Kaartjes: volwassenen € 24,50 — kinderen (3 t/m 12 jaar) € 20,50 — kinderen onder 3 jaar gratis
Online kopen is € 2 goedkoper!
Parkeren: € 6 per dag
Met de bus: lijn 4 vanaf station Amersfoort Centraal`,
    questions: [
      mc('Hoeveel betaalt een kind van 2 jaar?', 'Niets', '€ 20,50', '€ 24,50'),
      mc('Hoe kunt u goedkoper een kaartje kopen?', 'Online', 'Met de bus', 'Na 17.00 uur'),
      mc('Hoe laat sluit het park in december?', 'Om 17.00 uur', 'Om 18.00 uur', 'Om 9.00 uur'),
    ],
  },

  // ---------- Unit 4 ----------
  {
    id: 'r4-gemeente-afval',
    unit: 4,
    title: 'Brief van de gemeente over afval',
    genre: 'letter',
    body: `Beste bewoner,
Vanaf 1 januari verandert de afvalinzameling in uw wijk.
De groene container (groente-, fruit- en tuinafval) wordt elke week op maandag geleegd.
De grijze container (restafval) wordt nog maar één keer per twee weken geleegd, op donderdag.
Plastic, blik en pakken gooit u in de oranje container op de hoek van uw straat.
Zet uw container voor 7.30 uur aan de straat.
Vragen? Kijk op www.zeist.nl/afval.`,
    questions: [
      mc('Hoe vaak wordt de grijze container geleegd?', 'Eén keer per twee weken', 'Elke week', 'Elke dag'),
      mc('Waar gooit u een lege fles shampoo (plastic)?', 'In de oranje container', 'In de groene container', 'In de grijze container'),
      mc('Wanneer moet de container buiten staan?', 'Voor half acht', 'Na zes uur', "'s Avonds"),
    ],
  },
  {
    id: 'r4-koningsdag',
    unit: 4,
    title: 'Koningsdag in Utrecht',
    genre: 'article',
    body: `Koningsdag in Utrecht
Op 27 april is het Koningsdag. Dan is de verjaardag van koning Willem-Alexander.
In heel Nederland zijn er vrijmarkten: iedereen mag dan op straat spullen verkopen.
In Utrecht begint de vrijmarkt al op de avond van 26 april om 18.00 uur.
Veel mensen dragen oranje kleren. Er is muziek in de stad.
Let op: op Koningsdag rijden er minder bussen in het centrum.`,
    questions: [
      mc('Waarom is 27 april een feestdag?', 'Het is de verjaardag van de koning', 'Het is het einde van de oorlog', 'Het is Nieuwjaar'),
      mc('Wat is een vrijmarkt?', 'Iedereen mag op straat spullen verkopen', 'Alles in de winkel is gratis', 'Een markt alleen voor kinderen'),
      mc('Wanneer begint de vrijmarkt in Utrecht?', 'Op 26 april om 18.00 uur', 'Op 27 april om 6 uur', 'Op 28 april'),
    ],
  },
  {
    id: 'r4-politie',
    unit: 4,
    title: 'Fiets gestolen?',
    genre: 'notice',
    body: `Is uw fiets gestolen? Doe aangifte!
U kunt aangifte doen via internet op politie.nl, of op het politiebureau.
Wat heeft u nodig?
- het framenummer van uw fiets
- de kleur en het merk
- de plaats en de tijd van de diefstal
Tip: schrijf het framenummer van uw fiets nu al op. Zet een goed slot op uw fiets: een kettingslot of een beugelslot.`,
    questions: [
      mc('Waar kunt u aangifte doen?', 'Op internet of op het politiebureau', 'Alleen bij de gemeente', 'In de fietsenwinkel'),
      mc('Wat moet u weten voor de aangifte?', 'Het framenummer van de fiets', 'Uw salaris', 'De naam van de dief'),
      mc('Wat is de tip van de politie?', 'Het framenummer nu al opschrijven', 'Geen fiets kopen', 'Uw fiets in huis zetten'),
    ],
  },
  {
    id: 'r4-bruiloft',
    unit: 4,
    title: 'Trouwkaart',
    genre: 'message',
    body: `Na zeven jaar samenwonen gaan wij trouwen!
Lisa & Mohammed
Op vrijdag 14 juni om 14.00 uur in het gemeentehuis van Houten.
Daarna is er een receptie van 15.30 tot 17.30 uur en een feest vanaf 20.00 uur in Zaal De Molen.
Wij hebben al alles voor ons huis. Een bijdrage in de envelop voor onze huwelijksreis vinden wij heel leuk!`,
    questions: [
      mc('Hoe lang wonen Lisa en Mohammed al samen?', 'Zeven jaar', 'Veertien jaar', 'Twee jaar'),
      mc('Waar trouwen ze?', 'In het gemeentehuis', 'In de kerk', 'In Zaal De Molen'),
      mc('Welk cadeau willen ze graag?', 'Geld voor hun huwelijksreis', 'Iets voor in huis', 'Bloemen'),
    ],
  },
  {
    id: 'r4-dijk',
    unit: 4,
    title: 'Nederland en het water',
    genre: 'article',
    body: `Ongeveer een kwart van Nederland ligt onder zeeniveau.
Zonder dijken en duinen zou een groot deel van het land onder water staan.
In 1953 was er een grote overstroming in Zeeland. Toen zijn meer dan 1800 mensen gestorven.
Daarna heeft Nederland de Deltawerken gebouwd: grote dammen en dijken tegen het water van de zee.
Waterschappen zorgen elke dag voor de dijken en het water in sloten en kanalen.`,
    questions: [
      mc('Hoeveel van Nederland ligt onder zeeniveau?', 'Ongeveer een kwart', 'Bijna alles', 'Niets'),
      mc('Wat gebeurde er in 1953?', 'Een grote overstroming', 'De Deltawerken waren klaar', 'Er kwam een nieuwe koning'),
      mc('Wie zorgt voor de dijken?', 'De waterschappen', 'De politie', 'De huisarts'),
    ],
  },

  // ---------- Unit 5 ----------
  {
    id: 'r5-vacature',
    unit: 5,
    title: 'Vacature: medewerker bakkerij',
    genre: 'ad',
    body: `Bakkerij Van Dam zoekt een medewerker winkel (20 uur per week)
Wat ga je doen? Je helpt klanten in de winkel, je zet brood en taart in de schappen en je houdt de winkel schoon.
Wat vragen wij? Je bent vriendelijk en je spreekt een beetje Nederlands. Je kunt op zaterdag werken.
Wat bieden wij? Een contract voor een half jaar, met kans op een vaste baan. Salaris volgens de cao.
Reageren? Stuur een korte brief en je cv naar vacature@bakkerijvandam.nl voor 15 mei.`,
    questions: [
      mc('Hoeveel uur per week is de baan?', 'Twintig uur', 'Veertig uur', 'Vijftien uur'),
      mc('Wat moet je kunnen?', 'Op zaterdag werken', 'Brood bakken', 'Goed Engels spreken'),
      mc('Hoe reageer je?', 'Een brief en cv mailen', 'Langskomen in de winkel', 'Bellen op zaterdag'),
    ],
  },
  {
    id: 'r5-ziekmelden',
    unit: 5,
    title: 'Regels bij ziekte (werk)',
    genre: 'instructions',
    body: `Ziek? Zo meld je je ziek:
1. Bel je leidinggevende vóór 8.00 uur. Een sms of WhatsApp is niet genoeg.
2. Vertel hoe lang je denkt dat je ziek bent. Je hoeft niet te vertellen wat je hebt.
3. Blijf bereikbaar op je telefoon.
4. Ben je weer beter? Meld je dan ook beter bij je leidinggevende.
Ben je langer dan een week ziek? Dan neemt de bedrijfsarts contact met je op.`,
    questions: [
      mc('Hoe meld je je ziek?', 'Je belt je leidinggevende voor 8 uur', 'Je stuurt een WhatsApp', 'Je mailt de bedrijfsarts'),
      mc('Wat hoef je niet te vertellen?', 'Welke ziekte je hebt', 'Hoe lang je ziek bent', 'Je telefoonnummer'),
      mc('Wanneer belt de bedrijfsarts?', 'Als je langer dan een week ziek bent', 'Na één dag', 'Nooit'),
    ],
  },
  {
    id: 'r5-sport',
    unit: 5,
    title: 'Gezond bewegen',
    genre: 'article',
    body: `Volwassenen moeten minstens 150 minuten per week bewegen, zegt de Gezondheidsraad. Dat is bijvoorbeeld vijf keer per week een half uur fietsen of wandelen.
Maar veel Nederlanders zitten de hele dag: op het werk, in de auto en op de bank voor de tv.
Tip: neem de trap in plaats van de lift, en ga op de fiets naar je werk.
Ook kinderen moeten genoeg bewegen: minstens een uur per dag.`,
    questions: [
      mc('Hoeveel moeten volwassenen minstens per week bewegen?', '150 minuten', '50 minuten', 'Een uur'),
      mc('Wat is een tip uit de tekst?', 'De trap nemen', 'Met de auto naar het werk', 'Minder fietsen'),
      mc('Hoeveel moeten kinderen bewegen?', 'Minstens een uur per dag', 'Een half uur per week', 'Twee uur per week'),
    ],
  },
  {
    id: 'r5-ind',
    unit: 5,
    title: 'Brief van de IND',
    genre: 'letter',
    body: `Geachte heer Haddad,
Uw verblijfsvergunning is geldig tot 1 april. U kunt een nieuwe vergunning aanvragen vanaf drie maanden voor deze datum.
Vraag de nieuwe vergunning op tijd aan. Dat kan online via de website van de IND.
U heeft daarvoor een DigiD nodig. Na de aanvraag krijgt u een brief met een afspraak voor een foto en vingerafdrukken.
Met vriendelijke groet, Immigratie- en Naturalisatiedienst`,
    questions: [
      mc('Wanneer kan meneer Haddad de nieuwe vergunning aanvragen?', 'Vanaf drie maanden voor 1 april', 'Na 1 april', 'Alleen op 1 april'),
      mc('Wat heeft hij nodig voor de online aanvraag?', 'Een DigiD', 'Een paspoortfoto', 'Een bankpas'),
      mc('Wat gebeurt er na de aanvraag?', 'Hij krijgt een brief met een afspraak', 'Hij krijgt meteen de vergunning', 'Hij moet naar de politie'),
    ],
  },
  {
    id: 'r5-museum',
    unit: 5,
    title: 'Museumkaart',
    genre: 'ad',
    body: `Met de Museumkaart bezoek je een jaar lang gratis meer dan 500 musea in Nederland!
Prijs: volwassenen € 75,– per jaar, jongeren tot 18 jaar € 37,50.
Je kunt de kaart kopen bij een museum of online. Online krijg je eerst een tijdelijke kaart; die is 31 dagen geldig en je kunt er 5 musea mee bezoeken.
Let op: voor sommige tentoonstellingen betaal je een kleine extra prijs.`,
    questions: [
      mc('Hoeveel kost de Museumkaart voor een volwassene?', '€ 75 per jaar', '€ 37,50 per jaar', '€ 5 per museum'),
      mc('Hoe lang is de tijdelijke kaart geldig?', '31 dagen', 'Een jaar', 'Vijf dagen'),
      mc('Wat is waar?', 'Soms betaal je iets extra', 'Alle musea zijn altijd gratis', 'De kaart is alleen voor jongeren'),
    ],
  },

  // ---------- Unit 6 ----------
  {
    id: 'r6-stempas',
    unit: 6,
    title: 'Uw stempas',
    genre: 'letter',
    body: `Gemeenteraadsverkiezingen woensdag 18 maart
U mag stemmen! Neem deze stempas en een geldig identiteitsbewijs mee naar het stembureau.
U mag in elk stembureau in de gemeente stemmen. De stembureaus zijn open van 7.30 tot 21.00 uur.
Kunt u niet zelf gaan? Dan kunt u iemand anders vragen om voor u te stemmen. Vul dan de achterkant van deze stempas in.
Kwijt? Vraag een nieuwe stempas aan bij de gemeente, uiterlijk 5 dagen voor de verkiezing.`,
    questions: [
      mc('Wat moet u meenemen naar het stembureau?', 'De stempas en een identiteitsbewijs', 'Alleen de stempas', 'Een brief van de politie'),
      mc('Waar mag u stemmen?', 'In elk stembureau in de gemeente', 'Alleen in uw straat', 'Alleen in het gemeentehuis'),
      mc('U kunt niet zelf gaan. Wat kunt u doen?', 'Iemand anders voor u laten stemmen', 'Thuis online stemmen', 'Een dag later stemmen'),
    ],
  },
  {
    id: 'r6-verhuizen',
    unit: 6,
    title: 'Verhuizen? Geef het door!',
    genre: 'instructions',
    body: `Gaat u verhuizen? Geef uw nieuwe adres door aan de gemeente.
Dat kan vanaf 4 weken voor de verhuizing tot uiterlijk 5 dagen na de verhuizing.
Doe het online met uw DigiD, of maak een afspraak bij de balie Burgerzaken.
De gemeente geeft uw nieuwe adres door aan andere organisaties, zoals de Belastingdienst.
Uw zorgverzekeraar, bank en werkgever moet u zelf informeren.`,
    questions: [
      mc('Wanneer moet u uw nieuwe adres doorgeven?', 'Uiterlijk 5 dagen na de verhuizing', 'Een jaar na de verhuizing', 'Alleen op de dag zelf'),
      mc('Aan wie geeft de gemeente het adres door?', 'Aan de Belastingdienst', 'Aan uw bank', 'Aan uw werkgever'),
      mc('Wie moet u zelf informeren?', 'Uw zorgverzekeraar', 'De Belastingdienst', 'De gemeente'),
    ],
  },
  {
    id: 'r6-klimaat',
    unit: 6,
    title: 'Energie besparen',
    genre: 'article',
    body: `Vijf tips om energie te besparen
1. Zet de verwarming een graad lager. Dat scheelt ongeveer 7% gas.
2. Douche korter: vijf minuten is genoeg.
3. Doe het licht uit als u een kamer uitgaat.
4. Was uw kleren op 30 graden in plaats van 60 graden.
5. Zet apparaten helemaal uit, niet op stand-by.
Bespaart u energie? Dan helpt u het klimaat én u betaalt minder.`,
    questions: [
      mc('Wat gebeurt er als u de verwarming een graad lager zet?', 'U gebruikt ongeveer 7% minder gas', 'Het huis wordt warmer', 'U betaalt meer'),
      mc('Hoe lang moet u volgens de tekst douchen?', 'Vijf minuten', 'Dertig minuten', 'Zestig minuten'),
      mc('Wat is het voordeel van energie besparen?', 'Het is goed voor het klimaat en goedkoper', 'U krijgt een nieuwe verwarming', 'De kleren worden schoner'),
    ],
  },
  {
    id: 'r6-buurt',
    unit: 6,
    title: 'Buurtbarbecue',
    genre: 'notice',
    body: `Buurtbarbecue — Zaterdag 6 juli vanaf 17.00 uur op het grasveld bij de speeltuin
Nieuwe buren leren kennen? Kom ook!
Iedereen neemt iets mee: een salade, een toetje of iets te drinken.
Het vlees en de vegetarische burgers regelt de bewonerscommissie. Kosten: € 5,– per volwassene, kinderen gratis.
Aanmelden bij Fatima (nr. 22) of Henk (nr. 31) vóór 1 juli.
Bij slecht weer gaan we naar het buurthuis.`,
    questions: [
      mc('Wat moeten mensen meenemen?', 'Een salade, toetje of drinken', 'Vlees', 'Niets'),
      mc('Hoeveel kost het voor een kind?', 'Niets', '€ 5', '€ 2,50'),
      mc('Wat gebeurt er als het regent?', 'De barbecue is in het buurthuis', 'De barbecue gaat niet door', 'Iedereen eet thuis'),
    ],
  },
  {
    id: 'r6-brief-vriend',
    unit: 6,
    title: 'E-mail van een vriendin',
    genre: 'email',
    body: `Hoi Selma,
Wat leuk dat je examen hebt gedaan! Hoe ging het? Ik denk dat het lezen wel goed ging, want je leest echt veel Nederlandse boeken.
Ik ben nu drie jaar in Nederland. Ik werk sinds januari bij een zorginstelling. Het werk is zwaar, maar mijn collega's zijn heel aardig.
Zullen we volgende week koffie drinken? Dan vertel je alles. Woensdagmiddag kan ik.
Liefs, Amira`,
    questions: [
      mc('Wat heeft Selma gedaan?', 'Een examen', 'Een nieuwe baan gevonden', 'Een boek geschreven'),
      mc('Hoe vindt Amira haar werk?', 'Zwaar, maar de collega\'s zijn aardig', 'Makkelijk en saai', 'Leuk maar slecht betaald'),
      mc('Wat wil Amira doen?', 'Koffie drinken met Selma', 'Samen lezen', 'Naar de zorginstelling gaan'),
    ],
  },

  // ---------- Mock exam items (unit 7) ----------
  {
    id: 'm-bibliotheek',
    unit: 7,
    title: 'Lid worden van de bibliotheek',
    genre: 'notice',
    body: `Lid worden van de bibliotheek
Tot 18 jaar: gratis
Volwassenen: € 4,50 per maand of € 49,– per jaar
Met een lidmaatschap leent u maximaal 10 boeken tegelijk, 3 weken lang.
Te laat? Dan betaalt u € 0,25 per boek per dag.
U kunt lid worden aan de balie. Neem een identiteitsbewijs en uw bankpas mee.`,
    questions: [
      mc('Hoeveel boeken kunt u tegelijk lenen?', 'Tien', 'Drie', 'Vier'),
      mc('U brengt een boek twee dagen te laat terug. Wat betaalt u?', '€ 0,50', '€ 0,25', '€ 4,50'),
      mc('Wat heeft u nodig om lid te worden?', 'Een identiteitsbewijs en bankpas', 'Een brief van de gemeente', 'Een foto'),
    ],
  },
  {
    id: 'm-zwembad',
    unit: 7,
    title: 'Zwembad De Vliet',
    genre: 'schedule',
    body: `Zwembad De Vliet — openingstijden recreatief zwemmen
Maandag t/m vrijdag: 12.00 – 13.00 en 19.00 – 21.00 uur
Zaterdag en zondag: 10.00 – 16.00 uur
Woensdagmiddag 14.00 – 16.00 uur: zwemmen voor ouders en kinderen tot 6 jaar
Vrouwenzwemmen: donderdag 20.00 – 21.30 uur
Entree: € 5,80. Tienrittenkaart: € 50,–`,
    questions: [
      mc('Wanneer is er vrouwenzwemmen?', 'Donderdagavond', 'Woensdagmiddag', 'Zaterdag'),
      mc('Wat kost een tienrittenkaart?', '€ 50,–', '€ 58,–', '€ 5,80'),
      mc('Kunt u op dinsdagochtend recreatief zwemmen?', 'Nee', 'Ja, van 10 tot 16 uur', 'Ja, van 12 tot 13 uur'),
    ],
  },
  {
    id: 'm-werkrooster',
    unit: 7,
    title: 'E-mail van de leidinggevende',
    genre: 'email',
    body: `Hallo allemaal,
Volgende week is Jan op vakantie. Daarom verandert het rooster.
Sara werkt op maandag en dinsdag van 7.00 tot 15.00 uur, in plaats van Jan.
Ahmed werkt op donderdag de late dienst (14.00 – 22.00 uur).
Kan iemand op vrijdag extra werken? Laat het mij voor woensdag weten.
Groet, Linda`,
    questions: [
      mc('Waarom verandert het rooster?', 'Jan is op vakantie', 'Sara is ziek', 'Linda gaat verhuizen'),
      mc('Wanneer werkt Ahmed?', 'Donderdag van 14.00 tot 22.00 uur', 'Maandag van 7.00 tot 15.00 uur', 'Vrijdag de hele dag'),
      mc('Wat vraagt Linda?', 'Wie kan er op vrijdag extra werken?', 'Wie wil er op vakantie?', 'Wie wil de late dienst op maandag?'),
    ],
  },
  {
    id: 'm-apotheek',
    unit: 7,
    title: 'Bijsluiter: paracetamol',
    genre: 'instructions',
    body: `Paracetamol 500 mg — tegen pijn en koorts
Volwassenen: 1 of 2 tabletten per keer, maximaal 6 tabletten per dag.
Neem minstens 4 uur tussen twee keer innemen.
Kinderen onder 12 jaar: vraag eerst advies aan de apotheek.
Neem de tabletten met een glas water.
Heeft u na 3 dagen nog steeds koorts? Bel dan de huisarts.`,
    questions: [
      mc('Hoeveel tabletten mag een volwassene maximaal per dag nemen?', 'Zes', 'Twee', 'Vier'),
      mc('Hoe lang moet u wachten tussen twee keer innemen?', 'Minstens vier uur', 'Een half uur', 'Een dag'),
      mc('U heeft na drie dagen nog koorts. Wat doet u?', 'De huisarts bellen', 'Meer tabletten nemen', 'Niets'),
    ],
  },
  {
    id: 'm-huurbaas',
    unit: 7,
    title: 'Brief van de woningcorporatie',
    genre: 'letter',
    body: `Beste huurder,
Op dinsdag 10 september komt een monteur de cv-ketel in uw woning controleren. Hij komt tussen 8.00 en 12.00 uur.
Zorg dat er iemand thuis is. Kan dat niet? Bel dan voor 5 september om een nieuwe afspraak te maken: 088 – 123 99 00.
Deze controle is gratis. De ketel moet elk jaar gecontroleerd worden, voor uw veiligheid.
Met vriendelijke groet, Woonstichting Groenwijk`,
    questions: [
      mc('Waarom komt de monteur?', 'Om de cv-ketel te controleren', 'Om een nieuwe keuken te plaatsen', 'Om de huur op te halen'),
      mc('U bent op 10 september niet thuis. Wat doet u?', 'Voor 5 september bellen', 'Niets', 'De monteur op 10 september bellen'),
      mc('Wat kost de controle?', 'Niets', '€ 88', 'Dat staat er niet'),
    ],
  },
  {
    id: 'm-cursus',
    unit: 7,
    title: 'Cursus fietsen voor volwassenen',
    genre: 'ad',
    body: `Leren fietsen? Dat kan op elke leeftijd!
In onze cursus leert u in 10 lessen veilig fietsen in het verkeer.
De lessen zijn op zaterdagochtend van 10.00 tot 11.30 uur bij het buurthuis.
Wij hebben fietsen en helmen; u hoeft niets mee te nemen.
Prijs: € 30,– voor de hele cursus. Met een Stadspas betaalt u de helft.
Aanmelden: bel Gerda, 06 – 11 22 33 44.`,
    questions: [
      mc('Hoeveel lessen heeft de cursus?', 'Tien', 'Dertig', 'Elf'),
      mc('Wat moet u meenemen?', 'Niets', 'Een fiets', 'Een helm'),
      mc('U heeft een Stadspas. Wat betaalt u?', '€ 15,–', '€ 30,–', 'Niets'),
    ],
  },
];
