// UNUM IN TRILLIONE | THE ENTIRE EDITABLE CERTAMEN QUESTION DATABASE
// Edit this file in GitHub. You do not need to change index.html.
//
// Each Q(...) is one question. Make its ID unique. Choose one of the
// seven CATEGORIES below, exactly as spelled. Add at least a few A(...) answers.
// A('Answer', 10)                 common answer -> 10 points
// A('Rare answer', 100)            obscure answer -> 100 points
// A('Jupiter', 10, ['Iuppiter'])   aliases can also be accepted
// Accepted scores: 10, 25, 40, 60, 80, 100. A pass earns 0.
// All answers here are human-curated examples, NOT actual player frequency data.
//
// Copy this template to the BOTTOM of QUESTION_BANK (before the final ]):
// Q('unique-question-id', 'MYTHOLOGY', 'Name ...', 'Clarification ...', [
//   A('Familiar answer', 10),
//   A('Unusual answer', 80, ['Alternate spelling']),
// ]),

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

    // DATA: [canonical accepted answer, curated rarity points, optional alternate spellings].
    // The numbers are editorial estimates, never measured player frequencies.
    const A = (name, points, aliases = []) => ({ name, points, aliases });
    const Q = (id, category, prompt, hint, answers) => ({ id, category, prompt, hint, answers });
    const QUESTION_BANK = [
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
      // ADD NEW QUESTIONS JUST ABOVE THIS COMMENT. Do not change the category spelling.
    ];

