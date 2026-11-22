// Append seven questions to the end of QUESTION_BANK for a new daily set.
// The last seven are daily; all earlier questions are practice.
// Format: Q('id', 'MYTHOLOGY', 'Prompt', 'Hint', [A('Answer', 40, ['Alias'])])
// Scores: 10, 25, 40, 60, 80, 100.

'use strict';

const CATEGORIES = [
  'MYTHOLOGY',
  'ROMAN HISTORY',
  'LATIN LANGUAGE',
  'LATIN LITERATURE',
  'ROMAN CULTURE',
  'ANCIENT GEOGRAPHY',
  'DERIVATIVES'
];

    // Answers: name, points, optional aliases.
    const A = (name, points, aliases = []) => ({ name, points, aliases });
    const Q = (id, category, prompt, hint, answers) => ({ id, category, prompt, hint, answers });
    const QUESTION_BANK = [
      // Practice archive.
      Q('gods', 'MYTHOLOGY', 'Name a Roman god or goddess.', 'Use a Roman name, rather than its Greek counterpart.', [
        A('Jupiter',10,['Iuppiter','Iupiter','Jove']), A('Juno',10,['Iuno']), A('Mars',10), A('Venus',10), A('Neptune',10,['Neptunus']),
        A('Minerva',10), A('Mercury',10,['Mercurius']), A('Apollo',25), A('Diana',25), A('Ceres',25),
        A('Vesta',25), A('Vulcan',25,['Vulcanus']), A('Bacchus',25,['Liber']), A('Saturn',25,['Saturnus']), A('Pluto',40,['Dis Pater']),
        A('Janus',40,['Ianus']), A('Proserpina',40), A('Bellona',60), A('Flora',60), A('Faunus',60), A('Pomona',80),
        A('Terminus',80), A('Quirinus',80), A('Portunus',100)
      ]),
      Q('emperors', 'ROMAN HISTORY', 'Name a Roman emperor.', 'Any emperor of the ancient Roman Empire is fair game if listed.', [
        A('Augustus',10,['Octavian']), A('Nero',10), A('Tiberius',25), A('Caligula',25,['Gaius Caligula']),
        A('Claudius',25), A('Trajan',25,['Traianus']), A('Hadrian',25,['Hadrianus']), A('Marcus Aurelius',25), A('Constantine I',25,['Constantine','Constantine the Great']),
        A('Commodus',40), A('Vespasian',40), A('Titus',40), A('Domitian',40), A('Diocletian',40), A('Antoninus Pius',40),
        A('Galba',60), A('Otho',60), A('Vitellius',60), A('Nerva',60), A('Septimius Severus',60), A('Caracalla',60),
        A('Aurelian',80,['Aurelianus']), A('Elagabalus',80), A('Julian',80,['Julian the Apostate']), A('Majorian',100), A('Romulus Augustulus',100)
      ]),
      Q('writers', 'LATIN LITERATURE', 'Name an ancient author who wrote in Latin.', 'Poets, historians, playwrights, and prose authors all count.', [
        A('Vergil',10,['Virgil','Publius Vergilius Maro']), A('Cicero',10,['Marcus Tullius Cicero']), A('Ovid',10,['Ovidius']), A('Julius Caesar',10,['Caesar']),
        A('Livy',25,['Livius','Titus Livius']), A('Horace',25,['Horatius']), A('Catullus',25), A('Tacitus',25), A('Seneca',25,['Seneca the Younger']),
        A('Plautus',40), A('Terence',40,['Terentius']), A('Lucretius',40), A('Martial',40,['Martialis']), A('Juvenal',40,['Iuvenalis']),
        A('Sallust',40,['Sallustius']), A('Pliny the Younger',40,['Pliny Minor']), A('Pliny the Elder',60,['Pliny Major']),
        A('Propertius',60), A('Tibullus',60), A('Lucan',60,['Lucanus']), A('Statius',60), A('Quintilian',60,['Quintilianus']),
        A('Apuleius',80), A('Suetonius',80), A('Varro',80), A('Ennius',100)
      ]),
      Q('aeneid', 'LATIN LITERATURE', 'Name a character in Vergil’s Aeneid.', 'Gods and mortals both count. Use their Latin or common English name.', [
        A('Aeneas',10), A('Dido',10), A('Turnus',10), A('Anchises',25), A('Ascanius',25,['Iulus']), A('Creusa',25),
        A('Juno',25,['Iuno']), A('Venus',25), A('Jupiter',25,['Iuppiter']), A('Mercury',40,['Mercurius']), A('Camilla',40),
        A('Lavinia',40), A('Latinus',40), A('Sibyl',40,['Cumaean Sibyl','Sibylla']), A('Palinurus',60), A('Nisus',60),
        A('Euryalus',60), A('Amata',60), A('Evander',60), A('Pallas',60), A('Anna',60), A('Achates',60),
        A('Mezentius',80), A('Lausus',80), A('Iarbas',80,['Iarbus']), A('Sinon',80), A('Juturna',80,['Iuturna']),
        A('Drances',100), A('Polydorus',100)
      ]),
      Q('prepositions', 'LATIN LANGUAGE', 'Name a Latin preposition.', 'Give the Latin word itself. Case-governing prepositions only.', [
        A('in',10), A('ad',10), A('cum',10), A('ex',10,['e']), A('ab',10,['a','abs']), A('de',10), A('per',10),
        A('pro',25), A('sub',25), A('post',25), A('ante',25), A('sine',25), A('inter',25), A('trans',25),
        A('super',40), A('apud',40), A('contra',40), A('extra',40), A('propter',40), A('circum',40), A('praeter',40),
        A('ob',60), A('supra',60), A('infra',60), A('intra',60), A('iuxta',60,['juxta']), A('ultra',60),
        A('circa',80), A('citra',80), A('cis',80), A('erga',80), A('penes',80), A('secundum',80), A('adversus',100)
      ]),
      Q('provinces', 'ANCIENT GEOGRAPHY', 'Name a province of the Roman Empire.', 'Use the province name, not a modern country name.', [
        A('Britannia',10), A('Aegyptus',10,['Egypt']), A('Syria',10), A('Asia',25), A('Macedonia',25),
        A('Hispania Tarraconensis',25,['Tarraconensis']), A('Gallia Narbonensis',25,['Narbonensis']), A('Africa Proconsularis',25),
        A('Judaea',40,['Iudaea']), A('Dacia',40), A('Achaia',40), A('Cilicia',40), A('Numidia',40),
        A('Lusitania',40), A('Hispania Baetica',40,['Baetica']), A('Gallia Belgica',60,['Belgica']),
        A('Gallia Aquitania',60,['Aquitania']), A('Germania Inferior',60), A('Germania Superior',60),
        A('Cappadocia',60), A('Dalmatia',60), A('Thracia',60), A('Pannonia',60), A('Noricum',80),
        A('Raetia',80,['Rhaetia']), A('Moesia Inferior',80), A('Moesia Superior',80), A('Arabia Petraea',100),
        A('Bithynia et Pontus',100,['Bithynia and Pontus'])
      ]),
      Q('offices', 'ROMAN HISTORY', 'Name a Roman public office or magistracy.', 'Republican and imperial public offices are eligible.', [
        A('Consul',10), A('Praetor',10), A('Quaestor',10), A('Aedile',25,['Aedilis']), A('Censor',25),
        A('Tribune of the Plebs',25,['Tribunus Plebis','Plebeian Tribune']), A('Dictator',25), A('Proconsul',40),
        A('Propraetor',40), A('Magister Equitum',40,['Master of the Horse']), A('Interrex',60),
        A('Praefectus Urbi',60,['Urban Prefect']), A('Praefectus Praetorio',60,['Praetorian Prefect']),
        A('Praefectus Annonae',80), A('Praefectus Vigilum',80), A('Duumvir',80), A('Decemvir',80),
        A('Triumvir Monetalis',100,['Tresviri Monetales'])
      ]),
      Q('festivals', 'ROMAN CULTURE', 'Name an ancient Roman religious festival.', 'Festival names are usually Latin.', [
        A('Saturnalia',10), A('Lupercalia',10), A('Floralia',25), A('Lemuria',25), A('Vestalia',25),
        A('Parilia',40,['Palilia']), A('Matronalia',40), A('Cerealia',40), A('Liberalia',40), A('Vinalia',40),
        A('Compitalia',60), A('Consualia',60), A('Neptunalia',60), A('Terminalia',60), A('Quinquatria',60),
        A('Megalesia',60), A('Robigalia',80), A('Fordicidia',80), A('Equirria',80), A('Armilustrium',80),
        A('Feriae Latinae',100), A('Opalia',100)
      ]),
      Q('roads', 'ANCIENT GEOGRAPHY', 'Name an ancient Roman road.', 'Include “Via” in your answer, or just give the road’s name.', [
        A('Via Appia',10,['Appia','Appian Way']), A('Via Flaminia',25,['Flaminia']), A('Via Aurelia',25,['Aurelia']),
        A('Via Egnatia',25,['Egnatia']), A('Via Sacra',25,['Sacra','Sacred Way']), A('Via Salaria',40,['Salaria']),
        A('Via Latina',40,['Latina']), A('Via Cassia',40,['Cassia']), A('Via Aemilia',40,['Aemilia']),
        A('Via Domitia',60,['Domitia']), A('Via Traiana',60,['Traiana']), A('Via Valeria',60,['Valeria']),
        A('Via Ostiensis',80,['Ostiensis']), A('Via Nomentana',80,['Nomentana']), A('Via Tiburtina',80,['Tiburtina']),
        A('Via Popilia',100,['Popilia'])
      ]),
      Q('battles', 'ROMAN HISTORY', 'Name a battle involving an ancient Roman army.', 'Give the commonly used name of the battle.', [
        A('Cannae',10), A('Zama',10), A('Actium',10), A('Pharsalus',25,['Pharsalia']), A('Alesia',25),
        A('Carrhae',25), A('Teutoburg Forest',25,['Teutoburg']), A('Lake Trasimene',40,['Trasimene']),
        A('Trebia',40), A('Pydna',40), A('Philippi',40), A('Milvian Bridge',40,['Battle of the Milvian Bridge']),
        A('Magnesia',60), A('Munda',60), A('Thapsus',60), A('Adrianople',60), A('Cynoscephalae',60),
        A('Aquae Sextiae',80), A('Sabis',80), A('Naulochus',80), A('Mutina',100)
      ]),
      Q('works', 'LATIN LITERATURE', 'Name a work of ancient Latin literature.', 'Give a title, not its author. Alternate Latin and English titles are accepted when listed.', [
        A('Aeneid',10,['Aeneis']), A('Metamorphoses',10), A('Georgics',25,['Georgica']), A('Eclogues',25,['Bucolics','Bucolica']),
        A('De Bello Gallico',25,['Gallic War']), A('De Rerum Natura',25,['On the Nature of Things']), A('Odes',25,['Carmina']),
        A('Ars Amatoria',40,['Art of Love']), A('Fasti',40), A('Tristia',40), A('Amores',40),
        A('Ab Urbe Condita',40,['History of Rome']), A('De Officiis',40,['On Duties']), A('Annals',40,['Annales']),
        A('Pharsalia',60,['Bellum Civile by Lucan']), A('Thebaid',60,['Thebais']), A('Golden Ass',60,['Metamorphoses by Apuleius']),
        A('Institutio Oratoria',60), A('Punica',80), A('Silvae',80), A('Epodes',80,['Epodi']),
        A('Bellum Catilinae',80,['Catiline Conspiracy']), A('De Agricultura',100,['De Agri Cultura'])
      ]),
      Q('devices', 'LATIN LITERATURE', 'Name a literary or rhetorical device in Latin poetry.', 'English or traditional Greek/Latin terminology is accepted.', [
        A('Alliteration',10), A('Anaphora',10), A('Hyperbaton',10), A('Chiasmus',25), A('Enjambment',25),
        A('Asyndeton',25), A('Polysyndeton',25), A('Personification',25), A('Metaphor',25), A('Simile',25),
        A('Apostrophe',40), A('Metonymy',40), A('Synecdoche',40), A('Litotes',40), A('Oxymoron',40),
        A('Ellipsis',40), A('Antithesis',40), A('Tricolon',40), A('Zeugma',60), A('Hendiadys',60),
        A('Hysteron Proteron',60), A('Polyptoton',60), A('Tmesis',80), A('Anadiplosis',80),
        A('Synchesis',80), A('Epizeuxis',80), A('Homeoteleuton',100,['Homoioteleuton'])
      ]),
      Q('cities', 'ANCIENT GEOGRAPHY', 'Name a city or town in ancient Italy.', 'Use its ancient name or an accepted modern equivalent.', [
        A('Rome',10,['Roma']), A('Pompeii',10), A('Herculaneum',10), A('Ostia',25), A('Naples',25,['Neapolis']),
        A('Capua',25), A('Ravenna',25), A('Brundisium',40,['Brindisi']), A('Tarentum',40,['Taranto']),
        A('Puteoli',40,['Pozzuoli']), A('Mediolanum',40,['Milan']), A('Aquileia',40),
        A('Cumae',60), A('Baiae',60), A('Tibur',60,['Tivoli']), A('Ariminum',60,['Rimini']),
        A('Praeneste',80,['Palestrina']), A('Arretium',80,['Arezzo']), A('Arpinum',80),
        A('Veii',80), A('Alba Longa',80), A('Tusculum',100), A('Volsinii',100)
      ]),
      Q('ovid', 'MYTHOLOGY', 'Name a character in Ovid’s Metamorphoses.', 'Mortals, mythic creatures, and gods all count.', [
        A('Narcissus',10), A('Echo',10), A('Daphne',10), A('Apollo',10), A('Icarus',25), A('Daedalus',25),
        A('Pygmalion',25), A('Orpheus',25), A('Eurydice',25), A('Arachne',25), A('Jupiter',25,['Iuppiter']),
        A('Europa',25), A('Actaeon',40), A('Cadmus',40), A('Niobe',40), A('Medusa',40), A('Perseus',40),
        A('Phaethon',40,['Phaeton']), A('Callisto',40), A('Io',40), A('Diana',40), A('Minerva',40),
        A('Pyramus',60), A('Thisbe',60), A('Philomela',60), A('Procne',60), A('Deucalion',60), A('Pyrrha',60),
        A('Baucis',80), A('Philemon',80), A('Lycaon',80), A('Atalanta',80), A('Hippomenes',80),
        A('Tereus',100), A('Myrrha',100)
      ]),
      Q('army', 'ROMAN CULTURE', 'Name a role, rank, or title in the Roman army.', 'Use a Latin term or its accepted English translation.', [
        A('Legionary',10,['Legionarius']), A('Centurion',10,['Centurio']), A('Legate',25,['Legatus']),
        A('Military Tribune',25,['Tribunus Militum']), A('Standard Bearer',25,['Signifer']),
        A('Decurion',40,['Decurio']), A('Optio',40), A('Primus Pilus',40), A('Aquilifer',40),
        A('Praefectus Castrorum',60,['Camp Prefect']), A('Cornicen',60), A('Tesserarius',60),
        A('Evocatus',80), A('Immunis',80), A('Vexillarius',80), A('Beneficiarius',100)
      ]),
      Q('conjunctions', 'LATIN LANGUAGE', 'Name a Latin conjunction.', 'Give the Latin word, not an English translation. Enclitic conjunctions count.', [
        A('et',10), A('sed',10), A('cum',10), A('ut',10), A('si',10), A('quia',10), A('aut',10),
        A('ne',25), A('atque',25,['ac']), A('-que',25), A('neque',25,['nec']),
        A('quod',25), A('dum',25), A('ubi',25), A('nisi',40), A('tamen',40), A('autem',40),
        A('nam',40), A('enim',40), A('vel',40), A('quamquam',40), A('quoniam',60),
        A('igitur',60), A('itaque',60), A('etsi',60), A('postquam',60), A('antequam',60),
        A('donec',80), A('quoad',80), A('sive',80,['seu']), A('simul atque',100), A('licet',100)
      ]),
      // EXTRA CERTAMEN PROMPTS. Keep each answer on an A(...) line.
      Q('mythical-heroes', 'MYTHOLOGY', 'Name a hero from Greek mythology.', 'Give a hero or heroine from a traditional Greek myth, rather than a deity.', [
        A('Heracles',10,['Hercules']), A('Odysseus',10,['Ulysses']), A('Achilles',10), A('Perseus',25),
        A('Theseus',25), A('Jason',25), A('Bellerophon',40), A('Atalanta',40), A('Orpheus',40),
        A('Diomedes',40), A('Hector',40), A('Aeneas',40), A('Ajax the Greater',60,['Telamonian Ajax']),
        A('Ajax the Lesser',60,['Locrian Ajax']), A('Meleager',60), A('Cadmus',60), A('Orestes',60),
        A('Peleus',80), A('Idomeneus',80), A('Amphiaraus',80), A('Tydeus',100)
      ]),
      Q('deponents', 'LATIN LANGUAGE', 'Name a Latin deponent verb.', 'Give the first-person singular present indicative form, such as loquor, not an English translation.', [
        A('loquor',10), A('sequor',10), A('conor',25), A('miror',25), A('hortor',25),
        A('patior',25), A('morior',25), A('utor',40), A('fruor',40), A('nascor',40),
        A('orior',40), A('proficiscor',60), A('gradior',60), A('fateor',60), A('vereor',60),
        A('polliceor',60), A('fungor',80), A('potior',80), A('nanciscor',80),
        A('obliviscor',80), A('reminiscor',100), A('vescor',100)
      ]),
      Q('roman-priesthoods', 'ROMAN CULTURE', 'Name an ancient Roman priesthood or priestly title.', 'Specific priestly offices and named priestly colleges count.', [
        A('Pontifex Maximus',10), A('Pontifex',25), A('Vestal Virgin',25,['Vestal','Vestalis']),
        A('Augur',25), A('Haruspex',40), A('Flamen',40), A('Flamen Dialis',40),
        A('Rex Sacrorum',60), A('Flamen Martialis',60), A('Flamen Quirinalis',60),
        A('Fetiales',60), A('Salii',60), A('Luperci',80), A('Arval Brethren',80,['Fratres Arvales']),
        A('Quindecimviri Sacris Faciundis',100,['Quindecimviri']), A('Septemviri Epulonum',100,['Epulones'])
      ]),
      Q('derivatives-scribo', 'DERIVATIVES', 'Name an English derivative of Latin scribo, scribere (to write).', 'Common English words containing the scrib/script root count if they are in the answer bank.', [
        A('script',10), A('describe',10), A('subscribe',10), A('manuscript',10),
        A('transcript',25), A('transcribe',25), A('inscription',25), A('prescribe',25),
        A('scripture',40), A('ascribe',40), A('circumscribe',40), A('conscript',40),
        A('postscript',60), A('superscript',60), A('proscribe',60),
        A('conscription',80), A('circumscription',80), A('prescription',25)
      ]),
      Q('derivatives-mitto', 'DERIVATIVES', 'Name an English derivative of Latin mitto, mittere (to send).', 'Words built on mit/miss, including compounds and nouns, count if listed.', [
        A('submit',10), A('admit',10), A('permit',10), A('transmit',10),
        A('commit',25), A('emit',25), A('omit',25), A('dismiss',25),
        A('mission',25), A('missile',40), A('missive',40), A('emissary',40),
        A('remit',40), A('remission',60), A('intermission',60), A('admission',60),
        A('transmission',60), A('permission',80), A('commissary',80), A('emission',80)
      ]),
      Q('derivatives-porto', 'DERIVATIVES', 'Name an English derivative of Latin porto, portare (to carry).', 'Words built on the Latin port root count if listed.', [
        A('transport',10), A('import',10), A('export',10), A('portable',10),
        A('report',25), A('support',25), A('deport',25), A('porter',25),
        A('portfolio',40), A('portage',40), A('importation',40), A('exportation',40),
        A('transportation',40), A('deportation',60), A('deportment',60),
        A('reporter',60), A('supporter',60), A('portability',80)
      ]),
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║ NEWEST SEVEN = LIVE DAILY CHALLENGE                            ║
      // ║ To publish the next edition, APPEND seven NEW Q(...) blocks     ║
      // ║ immediately BEFORE the closing ]; at the END of this file.     ║
      // ║ All older blocks automatically become practice questions.      ║
      // ║ Categories may repeat. NEVER replace or erase earlier blocks.  ║
      // ╚══════════════════════════════════════════════════════════════════╝
      Q('argonauts-2026-11-22', 'MYTHOLOGY',
        'Name someone who sailed aboard the Argo with Jason.',
        'Crew members named in any major ancient Argonaut tradition count. Greek and Roman spellings are accepted.', [
        A('Jason',10,['Iason']), A('Heracles',10,['Hercules','Herakles']), A('Orpheus',10),
        A('Castor',10), A('Polydeuces',10,['Pollux','Polydeukes']), A('Peleus',25),
        A('Telamon',25), A('Atalanta',25), A('Theseus',25), A('Meleager',25,['Meleagros']),
        A('Laertes',25), A('Calais',25,['Kalais']), A('Zetes',25,['Zethes']), A('Idas',25),
        A('Lynceus',25,['Lynkeus']), A('Mopsus',40,['Mopsos']), A('Admetus',40),
        A('Acastus',40,['Akastos']), A('Autolycus',40,['Autolykos']), A('Euphemus',40),
        A('Argus',40,['Argos']), A('Tiphys',40,['Tiphus']), A('Amphiaraus',40),
        A('Ancaeus',40,['Ankaios']), A('Eurytus',40), A('Butes',40), A('Iphiclus',40),
        A('Erginus',60), A('Oileus',60), A('Canthus',60,['Kanthos']), A('Augeas',60),
        A('Echion',60), A('Euryalus',60), A('Peneleus',60,['Peneleos']), A('Polyphemus',60),
        A('Periclymenus',60,['Periklymenos']), A('Cepheus',60,['Kepheus']), A('Leitus',60),
        A('Ascalaphus',60,['Askalaphos']), A('Ialmenus',60), A('Poeas',60,['Poias']),
        A('Menoetius',80,['Menoitios']), A('Palaemon',80,['Palaimonius']), A('Phanus',80),
        A('Staphylus',80), A('Iphitus',80), A('Asterius',80,['Asterion']), A('Coronus',80),
        A('Eurytion',80), A('Nauplius',80), A('Eurydamas',80), A('Aethalides',100),
        A('Deucalion',100), A('Iolaus',100), A('Caeneus',100,['Kaineus']),
        A('Hylas',100), A('Phalerus',100)
      ]),
      Q('second-punic-commanders-2026-11-22', 'ROMAN HISTORY',
        'Name a Roman military commander from the Second Punic War.',
        'The war ran from 218 to 201 BCE. Give a person, not a battle or place; family names alone may be ambiguous.', [
        A('Scipio Africanus',10,['Publius Cornelius Scipio Africanus','Scipio the Elder','Scipio Major']),
        A('Quintus Fabius Maximus',10,['Fabius Maximus','Fabius Cunctator','Quintus Fabius Maximus Verrucosus','Cunctator']),
        A('Marcus Claudius Marcellus',10,['Marcellus','Marcus Marcellus']),
        A('Gaius Terentius Varro',25,['Terentius Varro','Varro of Cannae']),
        A('Lucius Aemilius Paullus',25,['Aemilius Paullus','Lucius Aemilius Paulus']),
        A('Gaius Flaminius',25,['Flaminius']),
        A('Tiberius Sempronius Longus',25,['Sempronius Longus']),
        A('Gnaeus Cornelius Scipio Calvus',40,['Gnaeus Scipio','Scipio Calvus']),
        A('Publius Cornelius Scipio (consul 218)',40,['Publius Cornelius Scipio the Elder','Scipio father of Africanus','Publius Scipio father']),
        A('Gaius Claudius Nero',40,['Claudius Nero','Gaius Nero']),
        A('Marcus Livius Salinator',40,['Livius Salinator']),
        A('Gaius Laelius',40,['Laelius']),
        A('Marcus Minucius Rufus',40,['Minucius Rufus']),
        A('Quintus Fulvius Flaccus',40,['Fulvius Flaccus']),
        A('Marcus Valerius Laevinus',60,['Valerius Laevinus','Laevinus']),
        A('Publius Sulpicius Galba Maximus',60,['Sulpicius Galba Maximus','Galba Maximus']),
        A('Tiberius Sempronius Gracchus',60,['Sempronius Gracchus','Gracchus consul 215']),
        A('Appius Claudius Pulcher',60,['Claudius Pulcher consul 212']),
        A('Gnaeus Fulvius Centumalus',60,['Fulvius Centumalus','Gnaeus Fulvius Centumalus Maximus']),
        A('Lucius Postumius Albinus',60,['Postumius Albinus']),
        A('Titus Quinctius Crispinus',80,['Quinctius Crispinus']),
        A('Marcus Junius Silanus',80,['Junius Silanus'])
      ]),
      Q('cicero-titles-2026-11-22', 'LATIN LITERATURE',
        'Name a speech or other literary work by Cicero.',
        'Latin titles are preferred, but common English titles count. Collections such as the Philippics are accepted.', [
        A('In Catilinam',10,['Catilinarian Orations','Against Catiline','In Catilinam I','First Catilinarian']),
        A('Pro Archia',10,['Pro Archia Poeta','In Defense of Archias','For Archias']),
        A('Pro Caelio',10,['For Caelius','In Defense of Caelius']),
        A('Pro Milone',10,['For Milo','In Defense of Milo']),
        A('De Officiis',10,['On Duties','On Obligations']),
        A('De Re Publica',25,['De Republica','On the Republic']),
        A('De Legibus',25,['On the Laws']),
        A('De Oratore',25,['On the Orator']),
        A('De Natura Deorum',25,['On the Nature of the Gods']),
        A('In Verrem',25,['Verrines','Verrine Orations','Against Verres']),
        A('Philippicae',25,['Philippics','Philippica','Philippic Orations']),
        A('De Amicitia',25,['Laelius de Amicitia','Laelius','On Friendship']),
        A('De Senectute',25,['Cato Maior de Senectute','Cato Maior','On Old Age']),
        A('Tusculanae Disputationes',40,['Tusculan Disputations','Tusculanae']),
        A('De Finibus Bonorum et Malorum',40,['De Finibus','On Ends','On the Ends of Good and Evil']),
        A('De Divinatione',40,['On Divination']),
        A('Brutus',40,['Brutus sive de Claris Oratoribus']),
        A('Orator',40,['Orator ad M Brutum']),
        A('Pro Roscio Amerino',40,['For Roscius of Ameria','Pro Sexto Roscio']),
        A('Pro Murena',40,['For Murena']),
        A('Pro Cluentio',40,['For Cluentius']),
        A('De Imperio Cn. Pompei',40,['Pro Lege Manilia','De Imperio Gnaei Pompei','On the Command of Pompey']),
        A('Pro Sestio',60,['For Sestius']),
        A('Pro Sulla',60,['For Sulla']),
        A('Pro Flacco',60,['For Flaccus']),
        A('Pro Ligario',60,['For Ligarius']),
        A('Pro Marcello',60,['For Marcellus']),
        A('Pro Deiotaro',60,['For Deiotarus','Pro Rege Deiotaro']),
        A('Pro Balbo',60,['For Balbus']),
        A('In Pisonem',60,['Against Piso']),
        A('De Domo Sua',60,['On His House']),
        A('De Haruspicum Responsis',60,['De Haruspicum Responso','On the Responses of the Haruspices']),
        A('De Provinciis Consularibus',80,['On the Consular Provinces']),
        A('Post Reditum in Senatu',80,['Speech to the Senate After His Return']),
        A('Post Reditum ad Quirites',80,['Post Reditum in Quirites','Speech to the People After His Return']),
        A('Pro Plancio',80,['For Plancius']),
        A('Pro Scauro',80,['For Scaurus']),
        A('Pro Fonteio',80,['For Fonteius']),
        A('Pro Rabirio Postumo',80,['For Rabirius Postumus']),
        A('In Vatinium',80,['Against Vatinius']),
        A('Pro Quinctio',80,['For Quinctius']),
        A('Pro Tullio',80,['For Tullius']),
        A('Pro Roscio Comoedo',80,['For Roscius the Actor']),
        A('De Partitione Oratoria',100,['Partitiones Oratoriae','On the Divisions of Oratory']),
        A('Topica',100,['Topics']),
        A('Paradoxa Stoicorum',100,['Stoic Paradoxes']),
        A('De Fato',100,['On Fate']),
        A('Academica',100,['Academic Questions']),
        A('De Optimo Genere Oratorum',100,['On the Best Kind of Orators']),
        A('De Inventione',80,['On Invention']),
        A('Pro Rabirio Perduellionis Reo',100,['For Rabirius on a Charge of Treason'])
      ]),
      Q('dative-verbs-2026-11-22', 'LATIN LANGUAGE',
        'Name a Latin verb that can govern a dative complement.',
        'Give its dictionary first-person singular (or infinitive). Verbs with an established dative construction count, even if they also take other cases.', [
        A('pareo',10,['parere']), A('noceo',10,['nocere']), A('placeo',10,['placere']),
        A('persuadeo',10,['persuadere']), A('credo',10,['credere']),
        A('faveo',25,['favere']), A('servio',25,['servire']), A('resisto',25,['resistere']),
        A('studeo',25,['studere']), A('impero',25,['imperare']),
        A('ignosco',25,['ignoscere']), A('parco',25,['parcere']),
        A('invideo',25,['invidere']), A('suadeo',25,['suadere']),
        A('obedio',40,['obedire']), A('confido',40,['confidere']),
        A('diffido',40,['diffidere']), A('fido',40,['fidere']),
        A('indulgeo',40,['indulgere']), A('cedo',40,['cedere']),
        A('occurro',40,['occurrere']), A('obsto',40,['obstare']),
        A('prosum',40,['prodesse']), A('desum',40,['deesse']),
        A('succurro',60,['succurrere']), A('adversor',60,['adversari']),
        A('minitor',60,['minitari']), A('irascor',60,['irasci']),
        A('suscenseo',60,['suscensere']), A('tempero',60,['temperare']),
        A('obtempero',60,['obtemperare']), A('repugno',60,['repugnare']),
        A('displiceo',60,['displicere']), A('supplico',60,['supplicare']),
        A('nubo',80,['nubere']), A('medeor',80,['mederi']),
        A('insidior',80,['insidiari']), A('blandior',80,['blandiri']),
        A('gratulor',80,['gratulari']), A('ausculto',80,['auscultare']),
        A('praesum',80,['praeesse']), A('interdico',80,['interdicere']),
        A('mando',100,['mandare']), A('permitto',100,['permittere'])
      ]),
      Q('roman-clothing-2026-11-22', 'ROMAN CULTURE',
        'Name an item of clothing or footwear worn in ancient Rome.',
        'Latin terms, common English names, and named types of toga or tunic count. Jewelry and weapons do not.', [
        A('toga',10), A('tunica',10,['tunic']), A('stola',10), A('palla',10),
        A('caliga',10,['caligae','military boots']), A('solea',25,['soleae','sandals']),
        A('calceus',25,['calcei','Roman shoes']), A('paenula',25), A('sagum',25),
        A('paludamentum',25), A('pallium',25), A('lacerna',25),
        A('toga praetexta',40,['praetexta']), A('toga virilis',40,['toga pura','toga libera']),
        A('toga candida',40), A('toga picta',40), A('toga pulla',40),
        A('bracae',40,['breeches','trousers']), A('pileus',40,['pilleus','freedmans cap']),
        A('subligaculum',40,['subligar','loincloth']), A('strophium',40,['breast band','strophion']),
        A('fascia',40,['fascia pectoralis']), A('abolla',60), A('laena',60),
        A('trabea',60), A('ricinium',60), A('synthesis',60,['vestis cenatoria']),
        A('subucula',60,['tunica interior']), A('indusium',60),
        A('cucullus',60,['hood']), A('galerus',60,['galerum']),
        A('carbatina',60,['carbatinae']), A('soccus',60,['socci']),
        A('crepida',60,['crepidae']), A('cothurnus',60,['cothurni']),
        A('perones',80,['pero']), A('baxa',80,['baxae']), A('birrus',80),
        A('chlamys',80), A('cyclas',80), A('petasus',80),
        A('mitra',80), A('vitta',80,['vittae']),
        A('toga exigua',80), A('tunica recta',80),
        A('tunica laticlavia',80,['laticlavia','tunica lati clavi']),
        A('tunica angusticlavia',100,['angusticlavia','tunica angusti clavi']),
        A('flammeum',100,['bridal veil']), A('reticulum',100,['hairnet']),
        A('endromis',100), A('dalmatica',100), A('colobium',100)
      ]),
      Q('zeus-children-2026-11-22', 'MYTHOLOGY',
        'Name a child of Zeus in Greek mythology.',
        'Mortal or divine children attested in ancient traditions count. Greek and Roman equivalents, plus common spellings, are accepted.', [
        A('Athena',10,['Minerva','Athene']), A('Apollo',10,['Apollon']),
        A('Artemis',10,['Diana']), A('Ares',10,['Mars']),
        A('Hermes',10,['Mercury']), A('Dionysus',10,['Bacchus','Dionysos']),
        A('Heracles',10,['Hercules','Herakles']), A('Perseus',10),
        A('Helen',10,['Helen of Troy','Helene']), A('Persephone',25,['Proserpina','Kore']),
        A('Hephaestus',25,['Vulcan','Hephaistos']), A('Aphrodite',25,['Venus']),
        A('Hebe',25,['Juventas']), A('Eileithyia',25,['Ilithyia','Lucina']),
        A('Polydeuces',25,['Pollux','Polydeukes']),
        A('Minos',25), A('Rhadamanthys',25,['Rhadamanthus']),
        A('Sarpedon',25), A('Aeacus',25,['Aiakos']),
        A('Dardanus',40,['Dardanos']), A('Arcas',40,['Arkas']),
        A('Epaphus',40,['Epaphos']), A('Tantalus',40,['Tantalos']),
        A('Amphion',40), A('Zethus',40,['Zethos']),
        A('Calliope',40,['Kalliope']), A('Clio',40,['Kleio']),
        A('Erato',40), A('Euterpe',40),
        A('Melpomene',40), A('Polyhymnia',40,['Polymnia']),
        A('Terpsichore',40,['Terpsikhore']), A('Thalia',40,['Thaleia','Thalia the Muse']),
        A('Urania',40,['Ourania']),
        A('Eunomia',60), A('Dike',60,['Dice']), A('Eirene',60,['Irene']),
        A('Clotho',60,['Klotho']), A('Lachesis',60), A('Atropos',60),
        A('Aglaea',60,['Aglaia']), A('Euphrosyne',60),
                A('Lacedaemon',80,['Lakedaimon']), A('Macedon',80,['Makedon']),
        A('Magnes',80), A('Aethlius',80,['Aethlios']),
        A('Pandia',80,['Pandeia']), A('Ersa',100,['Herse']),
        A('Myrmidon',100)
      ]),
      Q('north-africa-cities-2026-11-22', 'ANCIENT GEOGRAPHY',
        'Name an ancient city in Roman North Africa west of Egypt.',
        'Places in Roman-era Mauretania, Numidia, Africa, Tripolitania, or Cyrenaica count. Ancient names or listed modern equivalents work.', [
        A('Carthage',10,['Carthago','Qart Hadasht']),
        A('Leptis Magna',10,['Lepcis Magna','Leptis']),
        A('Sabratha',10,['Sabrata']), A('Cyrene',10,['Kyrene']),
        A('Utica',25), A('Hippo Regius',25,['Hippo','Annaba']),
        A('Cirta',25,['Constantine']), A('Volubilis',25),
        A('Thugga',25,['Dougga']), A('Thamugadi',25,['Timgad']),
        A('Hadrumetum',25,['Hadrumetum Sousse','Sousse']),
        A('Bulla Regia',40), A('Lambaesis',40,['Lambese','Lambessa']),
        A('Cuicul',40,['Djemila','Cuicul Numidia']), A('Tipasa',40,['Tipaza']),
        A('Iol Caesarea',40,['Caesarea Mauretaniae','Cherchell','Iol']),
        A('Thapsus',40), A('Zama Regia',40,['Zama']),
        A('Sufetula',40,['Sbeitla']), A('Theveste',40,['Tebessa','Thebeste']),
        A('Capsa',40,['Gafsa']), A('Oea',40,['Tripoli']),
        A('Ptolemais',60,['Ptolemais Cyrenaica','Tolmeita']),
        A('Apollonia',60,['Apollonia Cyrenaica','Susa Libya']),
        A('Berenice',60,['Berenice Cyrenaica','Benghazi']),
        A('Barca',60,['Barce']), A('Taucheira',60,['Tocra','Teuchira']),
        A('Leptis Minor',60,['Leptiminus','Lemta']),
        A('Tacape',60,['Gabes']), A('Thuburbo Maius',60,['Thuburbo Majus']),
        A('Mactaris',60,['Makthar']), A('Sicca Veneria',60,['El Kef']),
        A('Tingis',60,['Tangier']), A('Lixus',60),
        A('Sala Colonia',80,['Sala','Chellah']), A('Banasa',80),
        A('Rusadir',80,['Melilla']), A('Zilis',80,['Asilah']),
        A('Rusicade',80,['Skikda']), A('Tiddis',80),
        A('Thubursicum Numidarum',80,['Khamissa']), A('Cillium',80,['Kasserine']),
        A('Sufes',100,['Sbiba']), A('Gigthis',100,['Gightis']),
        A('Pupput',100,['Hammamet']), A('Acholla',100,['Achola']),
        A('Neapolis',100,['Nabeul'])
      ]),
    ];
