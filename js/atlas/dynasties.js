// Dynasties and rulers of the atlas. Years below zero are BCE; `c: true` marks dates known only roughly.
//
// A dynasty sits in one lane of the dynasty chart, by where its capital lay (an empire that ruled far
// beyond its lane is still drawn in it). `capitals` are [name, lat, lng, from, to]; a capital without
// years served the whole dynasty. `built` names monuments of the monuments site (by id, see
// js/monuments.js) raised by a ruler or in a ruler's reign; a dynasty's own `built` holds those that no
// one ruler can claim. Sources: general histories (R. C. Majumdar, ed., The History and Culture of the
// Indian People; Romila Thapar, Early India; Satish Chandra, Medieval India) and the monuments' own
// records. `node tools/check-atlas.mjs` checks the dates, places and links.

export const LANES = [
  { id: 'northwest', name: 'North-west', note: 'The Indus, the Punjab, Kashmir and Afghanistan' },
  { id: 'north', name: 'North', note: 'The Ganga and Yamuna plains, from Delhi to Magadha' },
  { id: 'east', name: 'East', note: 'Bengal, Odisha and Assam' },
  { id: 'west', name: 'West', note: 'Gujarat, Rajasthan and Malwa' },
  { id: 'deccan', name: 'Deccan', note: 'Maharashtra, Telangana, Andhra and north Karnataka' },
  { id: 'south', name: 'South', note: 'The Tamil country, Kerala and south Karnataka' },
];

export const DYNASTIES = [
  // ---------- ancient ----------
  {
    id: 'haryanka', name: 'Haryanka', lane: 'north', start: -544, end: -413, c: true,
    capitals: [['Rajagriha', 25.03, 85.42, -544, -460], ['Pataliputra', 25.61, 85.14, -460, -413]],
    summary: 'The first great dynasty of Magadha, which made it the strongest of the sixteen states.',
    rulers: [
      { id: 'bimbisara', name: 'Bimbisara', start: -544, end: -492, c: true, note: 'Took Anga by war and allied with Kosala and Vaishali by marriage; a patron of the Buddha.' },
      { id: 'ajatashatru', name: 'Ajatashatru', start: -492, end: -460, c: true, note: 'Defeated the Vajji confederacy and fortified Pataligrama on the Ganga, the later Pataliputra.' },
    ],
  },
  {
    id: 'nanda', name: 'Nanda', lane: 'north', start: -345, end: -321, c: true,
    capitals: [['Pataliputra', 25.61, 85.14]],
    summary: 'The first empire of the Ganga plain, known to the Greeks for its great army and its wealth.',
    rulers: [
      { id: 'mahapadma-nanda', name: 'Mahapadma Nanda', start: -345, end: -329, c: true, note: 'Founder; the Puranas remember him as the destroyer of the old warrior houses.' },
      { id: 'dhana-nanda', name: 'Dhana Nanda', start: -329, end: -321, c: true, note: 'The last Nanda, whose army kept Alexander’s soldiers from crossing the Beas; overthrown by Chandragupta Maurya.' },
    ],
  },
  {
    id: 'maurya', name: 'Maurya', lane: 'north', start: -321, end: -185,
    capitals: [['Pataliputra', 25.61, 85.14]],
    summary: 'The first empire over most of the subcontinent, from Afghanistan to Karnataka.',
    rulers: [
      { id: 'chandragupta-maurya', name: 'Chandragupta Maurya', start: -321, end: -297, c: true, note: 'Overthrew the Nandas with Chanakya and won the north-west from Seleucus; Megasthenes lived at his court.' },
      { id: 'bindusara', name: 'Bindusara', start: -297, end: -273, c: true, note: 'Carried the empire into the Deccan.' },
      { id: 'ashoka', name: 'Ashoka', start: -268, end: -232, c: true, note: 'Conquered Kalinga, then turned to the dhamma and had his edicts cut on rocks and pillars across the empire.', built: ['sanchi-stupa'] },
    ],
  },
  {
    id: 'shunga', name: 'Shunga', lane: 'north', start: -185, end: -73, c: true,
    capitals: [['Pataliputra', 25.61, 85.14], ['Vidisha', 23.52, 77.81]],
    summary: 'Successors of the Mauryas in the Ganga plain and Malwa.',
    rulers: [
      { id: 'pushyamitra-shunga', name: 'Pushyamitra Shunga', start: -185, end: -149, c: true, note: 'The general who killed the last Maurya; he fought the Indo-Greeks.' },
    ],
  },
  {
    id: 'indo-greek', name: 'Indo-Greek kingdoms', lane: 'northwest', start: -180, end: 10, c: true,
    capitals: [['Taxila', 33.75, 72.8], ['Sagala', 32.49, 74.53]],
    summary: 'Greek kings from Bactria who ruled the Kabul valley and the Punjab and struck bilingual coins.',
    rulers: [
      { id: 'menander', name: 'Menander I', start: -165, end: -130, c: true, note: 'King Milinda of the Buddhist dialogue Milindapanha.' },
    ],
  },
  {
    id: 'satavahana', name: 'Satavahana', lane: 'deccan', start: -100, end: 220, c: true,
    capitals: [['Pratishthana', 19.48, 75.38, -100, 130], ['Amaravati', 16.57, 80.36, 130, 220]],
    summary: 'The first empire of the Deccan, whose trade reached Rome; the early caves at Ajanta were cut in its time.',
    built: ['ajanta-caves'],
    rulers: [
      { id: 'gautamiputra-satakarni', name: 'Gautamiputra Satakarni', start: 106, end: 130, c: true, note: 'Defeated the Western Satraps; his mother’s inscription at Nasik lists his lands.' },
      { id: 'vasishthiputra-pulumavi', name: 'Vasishthiputra Pulumavi', start: 130, end: 158, c: true, note: 'Moved the kingdom’s centre east to the Krishna, where the stupa at Amaravati flourished.' },
    ],
  },
  {
    id: 'kushan', name: 'Kushan', lane: 'northwest', start: 30, end: 375, c: true,
    capitals: [['Purushapura', 34.01, 71.58], ['Mathura', 27.49, 77.67]],
    summary: 'Central Asian rulers from the Oxus to the Ganga; patrons of the Gandhara and Mathura schools of art.',
    rulers: [
      { id: 'kujula-kadphises', name: 'Kujula Kadphises', start: 30, end: 80, c: true, note: 'United the Yuezhi tribes and founded the empire.' },
      { id: 'kanishka', name: 'Kanishka', start: 127, end: 150, c: true, note: 'Ruled from Bactria to the Ganga; his Rabatak inscription names Saketa, Kausambi and Pataliputra. A great patron of Buddhism.' },
    ],
  },
  {
    id: 'western-satraps', name: 'Western Satraps', lane: 'west', start: 35, end: 405, c: true,
    capitals: [['Ujjain', 23.18, 75.78]],
    summary: 'Saka rulers of Gujarat, Malwa and Sindh, the Deccan kings’ great rivals.',
    rulers: [
      { id: 'rudradaman', name: 'Rudradaman I', start: 130, end: 150, c: true, note: 'Twice defeated the Satavahanas; his inscription at Junagadh is the first long one in Sanskrit.' },
    ],
  },
  {
    id: 'gupta', name: 'Gupta', lane: 'north', start: 320, end: 550, c: true,
    capitals: [['Pataliputra', 25.61, 85.14]],
    summary: 'The empire of the Ganga plain in a classical age of Sanskrit letters, science and temple building.',
    built: ['mahabodhi-temple', 'dhamek-stupa'],
    rulers: [
      { id: 'chandragupta-i', name: 'Chandragupta I', start: 319, end: 335, c: true, note: 'Founder of the empire; married the Licchavi princess Kumaradevi.' },
      { id: 'samudragupta', name: 'Samudragupta', start: 335, end: 375, c: true, note: 'Campaigned from the Ganga to Kanchi; the Allahabad pillar lists his conquests.' },
      { id: 'chandragupta-ii', name: 'Chandragupta II', start: 375, end: 415, c: true, note: 'Took Malwa and Gujarat from the Western Satraps; the pilgrim Faxian visited in his reign.' },
      { id: 'kumaragupta-i', name: 'Kumaragupta I', start: 415, end: 455, c: true, note: 'Founder of the monastery at Nalanda, by tradition.', built: ['nalanda-mahavihara'] },
      { id: 'skandagupta', name: 'Skandagupta', start: 455, end: 467, c: true, note: 'Held back the first Huna invasions.' },
    ],
  },
  {
    id: 'vakataka', name: 'Vakataka', lane: 'deccan', start: 250, end: 500, c: true,
    capitals: [['Nandivardhana', 21.37, 79.3], ['Vatsagulma', 20.11, 77.13]],
    summary: 'Rulers of the northern Deccan, allied to the Guptas by marriage; Ajanta’s later caves were cut in their time.',
    rulers: [
      { id: 'prabhavatigupta', name: 'Prabhavatigupta', start: 390, end: 410, c: true, note: 'Chandragupta II’s daughter, who ruled as regent for her sons.' },
      { id: 'harishena', name: 'Harishena', start: 460, end: 477, c: true, note: 'The last great Vakataka; most of Ajanta’s later caves were made in his reign.', built: ['ajanta-caves'] },
    ],
  },
  {
    id: 'pallava', name: 'Pallava', lane: 'south', start: 275, end: 897, c: true,
    capitals: [['Kanchipuram', 12.83, 79.7]],
    summary: 'Kings of Kanchi who began building in stone in the Tamil country, at Mamallapuram and Kanchi.',
    rulers: [
      { id: 'mahendravarman-i', name: 'Mahendravarman I', start: 600, end: 630, c: true, note: 'Began the rock-cut temples of the Tamil country; poet of the farce Mattavilasa.' },
      { id: 'narasimhavarman-i', name: 'Narasimhavarman I', start: 630, end: 668, c: true, note: 'Mamalla, the great wrestler; took the Chalukya capital Vatapi in 642. Mamallapuram is named after him.' },
      { id: 'narasimhavarman-ii', name: 'Narasimhavarman II', start: 700, end: 728, c: true, note: 'Rajasimha, builder of the Shore Temple and the Kailasanatha at Kanchi.', built: ['shore-temple'] },
    ],
  },
  {
    id: 'badami-chalukya', name: 'Chalukya of Badami', lane: 'deccan', start: 543, end: 753,
    capitals: [['Vatapi (Badami)', 15.92, 75.68]],
    summary: 'Masters of the Deccan whose temples at Badami, Aihole and Pattadakal mix northern and southern forms.',
    rulers: [
      { id: 'pulakeshin-ii', name: 'Pulakeshin II', start: 610, end: 642, c: true, note: 'Stopped Harsha at the Narmada; died when the Pallavas took Vatapi.' },
    ],
  },
  {
    id: 'pushyabhuti', name: 'Pushyabhuti (Harsha)', lane: 'north', start: 500, end: 647, c: true,
    capitals: [['Thanesar', 29.97, 76.82, 500, 606], ['Kannauj', 27.05, 79.92, 606, 647]],
    summary: 'The house of Harsha, the last king to rule most of the north before the Turkish conquests.',
    rulers: [
      { id: 'harsha', name: 'Harsha', start: 606, end: 647, note: 'Ruled the north from Kannauj; the pilgrim Xuanzang and the poet Banabhatta wrote of his court.' },
    ],
  },
  {
    id: 'karkota', name: 'Karkota', lane: 'northwest', start: 625, end: 855, c: true,
    capitals: [['Parihasapura', 34.11, 74.67]],
    summary: 'Kings of Kashmir, as told in Kalhana’s chronicle, the Rajatarangini.',
    rulers: [
      { id: 'lalitaditya', name: 'Lalitaditya Muktapida', start: 724, end: 760, c: true, note: 'Kashmir’s great conqueror; builder of the sun temple at Martand.' },
    ],
  },
  {
    id: 'rashtrakuta', name: 'Rashtrakuta', lane: 'deccan', start: 753, end: 982,
    capitals: [['Manyakheta', 17.2, 77.13, 818, 982]],
    summary: 'The Deccan’s great power of the 9th century, rivals of the Pratiharas and Palas for Kannauj.',
    rulers: [
      { id: 'dantidurga', name: 'Dantidurga', start: 735, end: 756, c: true, note: 'Overthrew the Chalukyas of Badami.' },
      { id: 'krishna-i', name: 'Krishna I', start: 756, end: 774, c: true, note: 'Had the Kailasa temple at Ellora cut down into the rock.', built: ['kailasa-temple'] },
      { id: 'amoghavarsha-i', name: 'Amoghavarsha I', start: 814, end: 878, note: 'Moved the capital to Manyakheta; ruled for 64 years, a patron of Kannada and Sanskrit letters.' },
    ],
  },
  {
    id: 'gurjara-pratihara', name: 'Gurjara-Pratihara', lane: 'north', start: 730, end: 1036, c: true,
    capitals: [['Kannauj', 27.05, 79.92, 816, 1036]],
    summary: 'Rulers of the north from Kannauj, who held back the Arabs of Sindh.',
    rulers: [
      { id: 'nagabhata-ii', name: 'Nagabhata II', start: 805, end: 833, c: true, note: 'Took Kannauj and made it the capital.' },
      { id: 'mihira-bhoja', name: 'Mihira Bhoja', start: 836, end: 885, c: true, note: 'Ruled from the Himalayan foothills to the Narmada; the Arab merchant Sulaiman praised his horsemen.' },
    ],
  },
  {
    id: 'pala', name: 'Pala', lane: 'east', start: 750, end: 1161, c: true,
    capitals: [['Pataliputra', 25.61, 85.14, 750, 850], ['Gauda', 24.87, 88.13, 850, 1161]],
    summary: 'Buddhist kings of Bengal and Bihar, patrons of Nalanda and Vikramashila.',
    rulers: [
      { id: 'gopala', name: 'Gopala', start: 750, end: 770, c: true, note: 'Chosen king by the chiefs of Bengal to end years of anarchy.' },
      { id: 'dharmapala', name: 'Dharmapala', start: 770, end: 810, c: true, note: 'Founded the monastery of Vikramashila and fought for Kannauj.' },
      { id: 'devapala', name: 'Devapala', start: 810, end: 850, c: true, note: 'The Palas at their height.' },
    ],
  },
  {
    id: 'western-ganga', name: 'Western Ganga', lane: 'south', start: 350, end: 1000, c: true,
    capitals: [['Talakad', 12.18, 77.03]],
    summary: 'Kings of southern Karnataka for six centuries, patrons of the Jains.',
    rulers: [
      { id: 'rachamalla-iv', name: 'Rachamalla IV', start: 975, end: 986, c: true, note: 'His minister Chavundaraya raised the colossal Gommateshwara at Shravanabelagola.', built: ['gommateshwara'] },
    ],
  },
  {
    id: 'chandela', name: 'Chandela', lane: 'north', start: 831, end: 1315, c: true,
    capitals: [['Khajuraho', 24.85, 79.93, 831, 1100], ['Mahoba', 25.29, 79.87, 1100, 1315]],
    summary: 'Rajput kings of Bundelkhand who built the temples of Khajuraho.',
    rulers: [
      { id: 'yashovarman', name: 'Yashovarman', start: 925, end: 950, c: true, note: 'Took the fort of Kalinjar and built the Lakshmana temple.' },
      { id: 'dhanga', name: 'Dhanga', start: 950, end: 999, c: true, note: 'The Vishvanatha and Parshvanath temples rose in his reign.', built: ['parshvanath-temple-khajuraho'] },
      { id: 'vidyadhara', name: 'Vidyadhara', start: 1003, end: 1035, c: true, note: 'Resisted Mahmud of Ghazni; the Kandariya Mahadeva is ascribed to him.', built: ['kandariya-mahadeva'] },
    ],
  },
  {
    id: 'chola', name: 'Chola', lane: 'south', start: 848, end: 1279,
    capitals: [['Thanjavur', 10.79, 79.14, 848, 1025], ['Gangaikonda Cholapuram', 11.21, 79.45, 1025, 1279]],
    summary: 'The great sea power of the south, whose armies reached the Ganga and whose fleets reached Southeast Asia.',
    rulers: [
      { id: 'vijayalaya', name: 'Vijayalaya', start: 848, end: 871, c: true, note: 'Took Thanjavur and refounded the dynasty.' },
      { id: 'rajaraja-i', name: 'Rajaraja I', start: 985, end: 1014, note: 'Conquered the south, the Maldives and northern Sri Lanka; built the Brihadeeswara temple.', built: ['brihadeeswara-temple'] },
      { id: 'rajendra-i', name: 'Rajendra I', start: 1014, end: 1044, note: 'Led his army to the Ganga and a fleet against Srivijaya; built a new capital, Gangaikonda Cholapuram.' },
      { id: 'kulottunga-i', name: 'Kulottunga I', start: 1070, end: 1122, note: 'United the Chola and Eastern Chalukya crowns.' },
    ],
  },
  {
    id: 'kalyani-chalukya', name: 'Chalukya of Kalyani', lane: 'deccan', start: 973, end: 1189,
    capitals: [['Kalyani', 17.87, 76.95]],
    summary: 'The Western Chalukyas, the Cholas’ long rivals across the Tungabhadra.',
    rulers: [
      { id: 'vikramaditya-vi', name: 'Vikramaditya VI', start: 1076, end: 1126, note: 'Began an era of his own; the poet Bilhana wrote his life.' },
    ],
  },
  {
    id: 'paramara', name: 'Paramara', lane: 'west', start: 800, end: 1305, c: true,
    capitals: [['Ujjain', 23.18, 75.78, 800, 1000], ['Dhar', 22.6, 75.3, 1000, 1305]],
    summary: 'Rajput kings of Malwa.',
    rulers: [
      { id: 'bhoja', name: 'Bhoja', start: 1010, end: 1055, c: true, note: 'Scholar-king of Dhar, author of works on poetics and architecture; built the temple at Bhojpur.' },
    ],
  },
  {
    id: 'chaulukya', name: 'Chaulukya (Solanki)', lane: 'west', start: 940, end: 1244, c: true,
    capitals: [['Anahilapataka', 23.85, 72.12]],
    summary: 'Kings of Gujarat under whom the Maru-Gurjara temples, stepwells and Jain shrines flourished.',
    rulers: [
      { id: 'bhima-i', name: 'Bhima I', start: 1022, end: 1064, c: true, note: 'Rebuilt Somnath after Mahmud’s raid; his minister Vimala built the Vimal Vasahi at Mount Abu, and his queen Udayamati the Rani ki Vav.', built: ['dilwara-temples', 'rani-ki-vav'] },
      { id: 'jayasimha-siddharaja', name: 'Jayasimha Siddharaja', start: 1092, end: 1142, note: 'Took Malwa from the Paramaras; patron of the scholar Hemachandra.' },
    ],
  },
  {
    id: 'ghaznavid', name: 'Ghaznavid', lane: 'northwest', start: 977, end: 1186,
    capitals: [['Ghazni', 33.55, 68.42, 977, 1163], ['Lahore', 31.55, 74.34, 1163, 1186]],
    summary: 'Turkish sultans of Ghazni who raided the north and held the Punjab.',
    rulers: [
      { id: 'mahmud-of-ghazni', name: 'Mahmud of Ghazni', start: 998, end: 1030, note: 'Raided India seventeen times, sacking Mathura, Kannauj and Somnath; the scholar Al-Biruni came with him.' },
    ],
  },
  {
    id: 'ghurid', name: 'Ghurid', lane: 'northwest', start: 1148, end: 1215, c: true,
    capitals: [['Ghazni', 33.55, 68.42]],
    summary: 'Sultans from the mountains of Ghor whose generals founded the Delhi Sultanate.',
    rulers: [
      { id: 'muhammad-of-ghor', name: 'Muhammad of Ghor', start: 1173, end: 1206, note: 'Lost to Prithviraj Chauhan at Tarain in 1191 and won there in 1192.' },
    ],
  },
  {
    id: 'chahamana', name: 'Chahamana (Chauhan)', lane: 'west', start: 900, end: 1194, c: true,
    capitals: [['Ajmer', 26.45, 74.64]],
    summary: 'Rajput kings of Sambhar and Ajmer.',
    rulers: [
      { id: 'prithviraj-chauhan', name: 'Prithviraj III', start: 1177, end: 1192, c: true, note: 'Prithviraj Chauhan, who beat Muhammad of Ghor at Tarain in 1191 and fell to him there in 1192.' },
    ],
  },
  {
    id: 'eastern-ganga', name: 'Eastern Ganga', lane: 'east', start: 1078, end: 1434,
    capitals: [['Cuttack', 20.46, 85.88]],
    summary: 'Kings of Odisha who built its greatest temples.',
    rulers: [
      { id: 'anantavarman-chodaganga', name: 'Anantavarman Chodaganga', start: 1078, end: 1147, note: 'Ruled from the Ganga to the Godavari and began the Jagannath temple at Puri.', built: ['jagannath-puri-temple'] },
      { id: 'narasimhadeva-i', name: 'Narasimhadeva I', start: 1238, end: 1264, note: 'Fought the sultans of Bengal and built the Sun Temple at Konark.', built: ['konark-sun-temple'] },
    ],
  },
  {
    id: 'kakatiya', name: 'Kakatiya', lane: 'deccan', start: 1163, end: 1323,
    capitals: [['Orugallu (Warangal)', 17.95, 79.61]],
    summary: 'Telugu kings of Warangal, builders of tanks, forts and star-shaped temples.',
    rulers: [
      { id: 'ganapatideva', name: 'Ganapatideva', start: 1199, end: 1262, note: 'Took the Andhra coast; his general Recharla Rudra built the Ramappa temple.', built: ['ramappa-temple'] },
      { id: 'rudramadevi', name: 'Rudramadevi', start: 1262, end: 1289, c: true, note: 'One of India’s few reigning queens; Marco Polo praised her rule.' },
    ],
  },
  {
    id: 'hoysala', name: 'Hoysala', lane: 'south', start: 1026, end: 1343, c: true,
    capitals: [['Belur', 13.16, 75.86, 1026, 1117], ['Dwarasamudra (Halebidu)', 13.21, 75.99, 1117, 1343]],
    summary: 'Kings of southern Karnataka famed for richly carved star-shaped temples in soapstone.',
    rulers: [
      { id: 'vishnuvardhana', name: 'Vishnuvardhana', start: 1108, end: 1152, c: true, note: 'Freed the Hoysalas from the Chalukyas and built the Chennakeshava temple at Belur.' },
      { id: 'narasimha-iii', name: 'Narasimha III', start: 1263, end: 1292, note: 'His commander Somanatha built the Chennakesava temple at Somanathapura.', built: ['chennakesava-temple'] },
    ],
  },
  // ---------- the sultanates ----------
  {
    id: 'mamluk', name: 'Mamluk (Slave) sultans of Delhi', lane: 'north', start: 1206, end: 1290,
    capitals: [['Delhi', 28.61, 77.21]],
    summary: 'The first sultans of Delhi, Turkish slave-soldiers become kings.',
    rulers: [
      { id: 'qutb-ud-din-aibak', name: 'Qutb ud-Din Aibak', start: 1206, end: 1210, note: 'Muhammad of Ghor’s general and the first sultan; began the Qutub Minar.' },
      { id: 'iltutmish', name: 'Iltutmish', start: 1211, end: 1236, note: 'Made Delhi the capital of a lasting state and completed the Qutub Minar.', built: ['qutub-minar'] },
      { id: 'razia', name: 'Razia Sultan', start: 1236, end: 1240, note: 'The only woman to sit on the throne of Delhi.' },
      { id: 'balban', name: 'Balban', start: 1266, end: 1287, note: 'Restored the sultan’s authority and kept the Mongols out.' },
    ],
  },
  {
    id: 'khalji', name: 'Khalji', lane: 'north', start: 1290, end: 1320,
    capitals: [['Delhi', 28.61, 77.21]],
    summary: 'Sultans of Delhi who carried their arms into the Deccan and the far south.',
    rulers: [
      { id: 'alauddin-khalji', name: 'Alauddin Khalji', start: 1296, end: 1316, note: 'Beat back the Mongols, took Chittor and Ranthambhore, and sent Malik Kafur to Madurai.' },
    ],
  },
  {
    id: 'tughlaq', name: 'Tughlaq', lane: 'north', start: 1320, end: 1414,
    capitals: [['Delhi', 28.61, 77.21, 1320, 1327], ['Daulatabad', 19.94, 75.21, 1327, 1335], ['Delhi', 28.61, 77.21, 1335, 1414]],
    summary: 'The Delhi Sultanate at its widest, and then its break-up.',
    rulers: [
      { id: 'muhammad-bin-tughluq', name: 'Muhammad bin Tughluq', start: 1325, end: 1351, note: 'Moved his capital to Daulatabad and back, and tried a token copper coinage; Ibn Battuta served him.', built: ['daulatabad-fort'] },
      { id: 'firuz-shah-tughlaq', name: 'Firuz Shah Tughlaq', start: 1351, end: 1388, note: 'Builder of canals and towns; rebuilt the top of the Qutub Minar.' },
    ],
  },
  {
    id: 'lodi', name: 'Lodi', lane: 'north', start: 1451, end: 1526,
    capitals: [['Delhi', 28.61, 77.21, 1451, 1506], ['Agra', 27.18, 78.01, 1506, 1526]],
    summary: 'Afghan sultans, the last rulers of the Delhi Sultanate.',
    rulers: [
      { id: 'sikandar-lodi', name: 'Sikandar Lodi', start: 1489, end: 1517, note: 'Founded Agra as his capital.' },
      { id: 'ibrahim-lodi', name: 'Ibrahim Lodi', start: 1517, end: 1526, note: 'Killed fighting Babur at the first battle of Panipat.' },
    ],
  },
  {
    id: 'yadava', name: 'Yadava (Seuna)', lane: 'deccan', start: 1187, end: 1317,
    capitals: [['Devagiri', 19.94, 75.21]],
    summary: 'Kings of the western Deccan, overthrown by the Khaljis.',
    built: ['daulatabad-fort'],
    rulers: [
      { id: 'ramachandra-yadava', name: 'Ramachandra', start: 1271, end: 1311, c: true, note: 'Paid tribute to Alauddin Khalji after Devagiri fell in 1296.' },
    ],
  },
  {
    id: 'vijayanagara', name: 'Vijayanagara', lane: 'south', start: 1336, end: 1646,
    capitals: [['Vijayanagara (Hampi)', 15.33, 76.46, 1336, 1565], ['Penukonda', 14.08, 77.59, 1565, 1592], ['Chandragiri', 13.59, 79.32, 1592, 1646]],
    summary: 'The empire of the south for two centuries, its capital at Hampi one of the great cities of the world.',
    built: ['mallikarjuna-temple'],
    rulers: [
      { id: 'harihara-bukka', name: 'Harihara I and Bukka I', start: 1336, end: 1377, note: 'The brothers who founded the empire on the Tungabhadra.' },
      { id: 'deva-raya-ii', name: 'Deva Raya II', start: 1424, end: 1446, note: 'Brought Turkish archers into his army; the Persian envoy Abdur Razzaq described his court.' },
      { id: 'krishnadevaraya', name: 'Krishnadevaraya', start: 1509, end: 1529, note: 'The empire at its height; poet in Telugu and patron of the Vittala temple.', built: ['vittala-temple-hampi'] },
      { id: 'aliya-rama-raya', name: 'Aliya Rama Raya', start: 1542, end: 1565, note: 'Regent who fell at Talikota, after which Hampi was sacked.' },
    ],
  },
  {
    id: 'bahmani', name: 'Bahmani', lane: 'deccan', start: 1347, end: 1527,
    capitals: [['Gulbarga', 17.33, 76.83, 1347, 1425], ['Bidar', 17.91, 77.52, 1425, 1527]],
    summary: 'The first sultanate of the Deccan, which broke into five.',
    rulers: [
      { id: 'alauddin-bahman-shah', name: 'Alauddin Bahman Shah', start: 1347, end: 1358, note: 'Rebelled against Muhammad bin Tughluq and founded the sultanate.' },
      { id: 'mahmud-gawan', name: 'Mahmud Gawan (minister)', start: 1466, end: 1481, note: 'The great minister who built the madrasa at Bidar.' },
    ],
  },
  {
    id: 'bengal-sultanate', name: 'Sultanate of Bengal', lane: 'east', start: 1352, end: 1576,
    capitals: [['Pandua', 25.14, 88.15, 1352, 1450], ['Gaur', 24.87, 88.13, 1450, 1576]],
    summary: 'Independent sultans of Bengal, builders in brick and terracotta.',
    rulers: [
      { id: 'ilyas-shah', name: 'Shamsuddin Ilyas Shah', start: 1352, end: 1358, note: 'United Bengal under one sultan.' },
      { id: 'alauddin-husain-shah', name: 'Alauddin Husain Shah', start: 1494, end: 1519, note: 'Patron of Bengali letters; Chaitanya preached in his time.' },
    ],
  },
  {
    id: 'gujarat-sultanate', name: 'Sultanate of Gujarat', lane: 'west', start: 1407, end: 1573,
    capitals: [['Ahmedabad', 23.03, 72.58]],
    summary: 'Sultans of Gujarat and its ports, until Akbar took them.',
    rulers: [
      { id: 'ahmad-shah-i', name: 'Ahmad Shah I', start: 1411, end: 1442, note: 'Founded Ahmedabad in 1411.' },
      { id: 'mahmud-begada', name: 'Mahmud Begada', start: 1458, end: 1511, note: 'Took Pavagadh and Junagadh; fought the Portuguese at sea.' },
    ],
  },
  // ---------- Rajput and regional houses ----------
  {
    id: 'sisodia', name: 'Sisodia of Mewar', lane: 'west', start: 1326, end: 1949,
    capitals: [['Chittor', 24.89, 74.65, 1326, 1568], ['Udaipur', 24.58, 73.68, 1568, 1949]],
    summary: 'The Ranas of Mewar, the senior Rajput house, who longest refused the Mughals.',
    rulers: [
      { id: 'rana-kumbha', name: 'Rana Kumbha', start: 1433, end: 1468, note: 'Raised the Vijay Stambh at Chittor and built the fort of Kumbhalgarh.', built: ['chittorgarh-fort'] },
      { id: 'rana-sanga', name: 'Rana Sanga', start: 1508, end: 1528, note: 'Led the Rajput alliance against Babur at Khanwa.' },
      { id: 'udai-singh-ii', name: 'Udai Singh II', start: 1540, end: 1572, note: 'Founded Udaipur after Akbar took Chittor.', built: ['city-palace-udaipur'] },
      { id: 'maharana-pratap', name: 'Maharana Pratap', start: 1572, end: 1597, note: 'Fought Akbar’s army at Haldighati in 1576 and held out in the hills.' },
    ],
  },
  {
    id: 'rathore', name: 'Rathore of Marwar', lane: 'west', start: 1438, end: 1949,
    capitals: [['Jodhpur', 26.3, 73.02, 1459, 1949]],
    summary: 'Rajput rulers of Marwar in the Thar.',
    rulers: [
      { id: 'rao-jodha', name: 'Rao Jodha', start: 1438, end: 1489, note: 'Founded Jodhpur and its fort, Mehrangarh, in 1459.', built: ['mehrangarh-fort'] },
    ],
  },
  {
    id: 'bhati', name: 'Bhati of Jaisalmer', lane: 'west', start: 1156, end: 1949,
    capitals: [['Jaisalmer', 26.91, 70.91]],
    summary: 'Rajput rulers of the desert kingdom of Jaisalmer, rich from the caravan trade.',
    rulers: [
      { id: 'rawal-jaisal', name: 'Rawal Jaisal', start: 1156, end: 1168, c: true, note: 'Founded Jaisalmer and its fort on Trikuta hill.', built: ['jaisalmer-fort'] },
    ],
  },
  {
    id: 'kachwaha', name: 'Kachwaha of Amber and Jaipur', lane: 'west', start: 1100, end: 1949, c: true,
    capitals: [['Amber', 26.99, 75.85, 1100, 1727], ['Jaipur', 26.92, 75.82, 1727, 1949]],
    summary: 'Rajput rulers who became the Mughals’ closest allies.',
    rulers: [
      { id: 'man-singh-i', name: 'Man Singh I', start: 1589, end: 1614, note: 'One of Akbar’s great generals; began the palace-fort at Amber.', built: ['amber-fort'] },
      { id: 'jai-singh-ii', name: 'Sawai Jai Singh II', start: 1699, end: 1743, note: 'Founded Jaipur in 1727 and built the Jantar Mantar observatories.' },
      { id: 'pratap-singh', name: 'Sawai Pratap Singh', start: 1778, end: 1803, note: 'Poet-king who built the Hawa Mahal.', built: ['hawa-mahal'] },
    ],
  },
  {
    id: 'tomar-gwalior', name: 'Tomar of Gwalior', lane: 'north', start: 1394, end: 1523,
    capitals: [['Gwalior', 26.23, 78.17]],
    summary: 'Rajput rulers of Gwalior, patrons of music.',
    rulers: [
      { id: 'man-singh-tomar', name: 'Man Singh Tomar', start: 1486, end: 1516, note: 'Built the tiled Man Mandir palace on Gwalior fort; a patron of dhrupad music.', built: ['gwalior-fort'] },
    ],
  },
  {
    id: 'ahom', name: 'Ahom', lane: 'east', start: 1228, end: 1826,
    capitals: [['Charaideo', 26.94, 94.83, 1228, 1540], ['Garhgaon', 26.95, 94.73, 1540, 1707], ['Rangpur', 26.98, 94.63, 1707, 1826]],
    summary: 'Kings of the Brahmaputra valley for six centuries, who beat back the Mughals.',
    rulers: [
      { id: 'sukaphaa', name: 'Sukaphaa', start: 1228, end: 1268, note: 'Led the Tai Ahom over the Patkai hills and founded the kingdom.' },
      { id: 'rudra-singha', name: 'Rudra Singha', start: 1696, end: 1714, note: 'The kingdom at its height.' },
    ],
  },
  {
    id: 'koch', name: 'Koch', lane: 'east', start: 1515, end: 1949,
    capitals: [['Cooch Behar', 26.32, 89.45]],
    summary: 'Kings of Cooch Behar and lower Assam.',
    rulers: [
      { id: 'nara-narayan', name: 'Nara Narayan', start: 1540, end: 1587, note: 'His brother Chilarai rebuilt the Kamakhya temple in 1565.', built: ['kamakhya-temple'] },
      { id: 'nripendra-narayan', name: 'Nripendra Narayan', start: 1863, end: 1911, note: 'Built the palace at Cooch Behar in 1887.', built: ['cooch-behar-palace'] },
    ],
  },
  {
    id: 'deccan-sultanates', name: 'Deccan sultanates', lane: 'deccan', start: 1490, end: 1687,
    capitals: [['Bijapur', 16.83, 75.71], ['Golconda', 17.38, 78.4], ['Ahmadnagar', 19.09, 74.74, 1490, 1636]],
    summary: 'The five kingdoms that followed the Bahmanis: Bijapur, Golconda, Ahmadnagar, Berar and Bidar.',
    built: ['golconda-fort', 'qutb-shahi-tombs'],
    rulers: [
      { id: 'muhammad-quli-qutb-shah', name: 'Muhammad Quli Qutb Shah', start: 1580, end: 1612, note: 'Sultan of Golconda; founded Hyderabad and built the Charminar.', built: ['charminar'] },
      { id: 'malik-ambar', name: 'Malik Ambar (regent)', start: 1600, end: 1626, note: 'Ethiopian-born regent of Ahmadnagar who held the Mughals off for a generation.' },
      { id: 'muhammad-adil-shah', name: 'Muhammad Adil Shah', start: 1627, end: 1656, note: 'Sultan of Bijapur, whose tomb is the Gol Gumbaz.', built: ['gol-gumbaz'] },
    ],
  },
  {
    id: 'keladi', name: 'Keladi Nayaka', lane: 'south', start: 1499, end: 1763,
    capitals: [['Ikkeri', 14.15, 75.03, 1560, 1640], ['Bidanur', 13.85, 75.04, 1640, 1763]],
    summary: 'Rulers of the Kanara coast after Vijayanagara.',
    rulers: [
      { id: 'shivappa-nayaka', name: 'Shivappa Nayaka', start: 1645, end: 1660, note: 'Built the fort at Bekal and reformed the land revenue.', built: ['bekal-fort'] },
    ],
  },
  {
    id: 'madurai-nayak', name: 'Nayaks of Madurai', lane: 'south', start: 1529, end: 1736,
    capitals: [['Madurai', 9.92, 78.12]],
    summary: 'Vijayanagara’s governors who became kings of the Tamil south and rebuilt its great temples.',
    rulers: [
      { id: 'thirumalai-nayak', name: 'Thirumalai Nayak', start: 1623, end: 1659, note: 'Builder of the Thirumalai Nayak palace and of much of the Meenakshi temple.', built: ['meenakshi-temple'] },
    ],
  },
  // ---------- Mughals and their successors ----------
  {
    id: 'mughal', name: 'Mughal', lane: 'north', start: 1526, end: 1857,
    capitals: [['Agra', 27.18, 78.01, 1526, 1571], ['Fatehpur Sikri', 27.09, 77.66, 1571, 1585], ['Lahore', 31.55, 74.34, 1585, 1598], ['Agra', 27.18, 78.01, 1598, 1648], ['Delhi (Shahjahanabad)', 28.66, 77.24, 1648, 1857]],
    summary: 'The empire that ruled most of the subcontinent in the 17th century, and its finest builders.',
    rulers: [
      { id: 'babur', name: 'Babur', start: 1526, end: 1530, note: 'Won at Panipat and Khanwa with guns and cavalry; wrote his memoirs, the Baburnama.' },
      { id: 'humayun', name: 'Humayun', start: 1530, end: 1556, note: 'Lost the empire to Sher Shah in 1540 and won it back in 1555.' },
      { id: 'akbar', name: 'Akbar', start: 1556, end: 1605, note: 'Built the empire province by province, allied with the Rajputs and held debates of all faiths at Fatehpur Sikri.', built: ['humayuns-tomb', 'agra-fort', 'panch-mahal', 'buland-darwaza'] },
      { id: 'jahangir', name: 'Jahangir', start: 1605, end: 1627, note: 'Patron of painting; completed Akbar’s tomb. His empress Nur Jahan built Itmad-ud-Daulah’s tomb.', built: ['akbars-tomb', 'itmad-ud-daulah'] },
      { id: 'shah-jahan', name: 'Shah Jahan', start: 1628, end: 1658, note: 'Built the Taj Mahal, the Red Fort and the Jama Masjid of his new Delhi.', built: ['taj-mahal', 'red-fort', 'jama-masjid'] },
      { id: 'aurangzeb', name: 'Aurangzeb', start: 1658, end: 1707, note: 'Carried the empire to its widest, taking Bijapur and Golconda, while wars with the Marathas wore it down.', built: ['bibi-ka-maqbara'] },
      { id: 'bahadur-shah-ii', name: 'Bahadur Shah II', start: 1837, end: 1857, note: 'The last emperor, a poet; exiled to Rangoon after the revolt of 1857.' },
    ],
  },
  {
    id: 'sur', name: 'Sur', lane: 'north', start: 1540, end: 1556,
    capitals: [['Delhi', 28.61, 77.21]],
    summary: 'Afghan rulers who drove Humayun out for fifteen years.',
    rulers: [
      { id: 'sher-shah-suri', name: 'Sher Shah Suri', start: 1540, end: 1545, note: 'Built the Grand Trunk Road, struck the silver rupiya and reformed the land revenue.', built: ['sher-shah-suri-tomb'] },
    ],
  },
  {
    id: 'maratha', name: 'Maratha', lane: 'deccan', start: 1674, end: 1818,
    capitals: [['Raigad', 18.23, 73.44, 1674, 1689], ['Satara', 17.68, 74.0, 1708, 1749], ['Pune', 18.52, 73.86, 1749, 1818]],
    summary: 'The kingdom Shivaji founded, which became a confederacy ruling much of India in the 18th century.',
    rulers: [
      { id: 'shivaji', name: 'Shivaji', start: 1674, end: 1680, note: 'Built a kingdom of hill forts against Bijapur and the Mughals; crowned at Raigad in 1674.' },
      { id: 'bajirao-i', name: 'Bajirao I (Peshwa)', start: 1720, end: 1740, note: 'Carried Maratha power north to Malwa and the gates of Delhi.' },
      { id: 'balaji-bajirao', name: 'Balaji Bajirao (Peshwa)', start: 1740, end: 1761, note: 'Ruled from Pune; his army was routed at the third battle of Panipat.', built: ['trimbakeshwar-temple'] },
      { id: 'ahilyabai-holkar', name: 'Ahilyabai Holkar', start: 1767, end: 1795, note: 'Queen of Indore who rebuilt temples across India, among them Kashi Vishwanath and Grishneshwar.', built: ['kashi-vishwanath-temple', 'grishneshwar-temple'] },
    ],
  },
  {
    id: 'awadh', name: 'Nawabs of Awadh', lane: 'north', start: 1722, end: 1856,
    capitals: [['Faizabad', 26.78, 82.14, 1722, 1775], ['Lucknow', 26.85, 80.95, 1775, 1856]],
    summary: 'Governors of Awadh who became rulers in their own right, patrons of Lucknow’s architecture and culture.',
    rulers: [
      { id: 'shuja-ud-daula', name: 'Shuja-ud-Daula', start: 1754, end: 1775, note: 'Built his father Safdarjung’s tomb in Delhi; beaten by the Company at Buxar.', built: ['safdarjung-tomb'] },
      { id: 'asaf-ud-daula', name: 'Asaf-ud-Daula', start: 1775, end: 1797, note: 'Moved the capital to Lucknow and built the Bara Imambara during the famine of 1784.', built: ['bara-imambara', 'rumi-darwaza'] },
      { id: 'muhammad-ali-shah', name: 'Muhammad Ali Shah', start: 1837, end: 1842, note: 'Built the Chota Imambara.', built: ['chota-imambara'] },
    ],
  },
  {
    id: 'nizam', name: 'Nizams of Hyderabad', lane: 'deccan', start: 1724, end: 1948,
    capitals: [['Aurangabad', 19.88, 75.34, 1724, 1763], ['Hyderabad', 17.36, 78.47, 1763, 1948]],
    summary: 'The Mughal governors of the Deccan who founded the largest princely state.',
    rulers: [
      { id: 'asaf-jah-i', name: 'Asaf Jah I', start: 1724, end: 1748, note: 'Founder of the dynasty.' },
      { id: 'mir-osman-ali-khan', name: 'Mir Osman Ali Khan', start: 1911, end: 1948, note: 'The last Nizam, in his time one of the richest men in the world.' },
    ],
  },
  {
    id: 'mysore', name: 'Mysore', lane: 'south', start: 1399, end: 1950,
    capitals: [['Mysore', 12.31, 76.65, 1399, 1610], ['Srirangapatna', 12.42, 76.68, 1610, 1799], ['Mysore', 12.31, 76.65, 1799, 1950]],
    summary: 'The Wadiyar kingdom, ruled for a time by Haidar Ali and Tipu Sultan.',
    rulers: [
      { id: 'haidar-ali', name: 'Haidar Ali', start: 1761, end: 1782, note: 'Soldier who took power in Mysore and fought the Company twice.' },
      { id: 'tipu-sultan', name: 'Tipu Sultan', start: 1782, end: 1799, note: 'The Tiger of Mysore; built his parents’ tomb and died defending Srirangapatna.', built: ['tipu-sultan-gumbaz'] },
      { id: 'krishnaraja-wadiyar-iv', name: 'Krishnaraja Wadiyar IV', start: 1902, end: 1940, note: 'Under him the new Mysore Palace was completed and the state modernised.', built: ['mysore-palace'] },
    ],
  },
  {
    id: 'travancore', name: 'Travancore', lane: 'south', start: 1729, end: 1949,
    capitals: [['Padmanabhapuram', 8.25, 77.33, 1729, 1795], ['Thiruvananthapuram', 8.52, 76.94, 1795, 1949]],
    summary: 'The kingdom of southern Kerala, dedicated by its founder to Padmanabha.',
    rulers: [
      { id: 'marthanda-varma', name: 'Marthanda Varma', start: 1729, end: 1758, note: 'Beat the Dutch at Colachel in 1741 and rebuilt the Padmanabhaswamy temple.', built: ['padmanabhaswamy-temple'] },
    ],
  },
  {
    id: 'gaekwad', name: 'Gaekwads of Baroda', lane: 'west', start: 1721, end: 1949,
    capitals: [['Baroda', 22.31, 73.18]],
    summary: 'Maratha rulers of Baroda in Gujarat.',
    rulers: [
      { id: 'sayajirao-iii', name: 'Sayajirao Gaekwad III', start: 1875, end: 1939, note: 'Reforming ruler who built the Laxmi Vilas Palace.', built: ['laxmi-vilas-palace'] },
    ],
  },
  {
    id: 'sikh-empire', name: 'Sikh Empire', lane: 'northwest', start: 1799, end: 1849,
    capitals: [['Lahore', 31.55, 74.34]],
    summary: 'The kingdom of the Punjab under Ranjit Singh and his heirs.',
    rulers: [
      { id: 'ranjit-singh', name: 'Ranjit Singh', start: 1801, end: 1839, note: 'United the Punjab, took Multan, Kashmir and Peshawar, and gilded the Harmandir Sahib.' },
    ],
  },
  // ---------- the British ----------
  {
    id: 'east-india-company', name: 'East India Company', lane: 'east', start: 1757, end: 1858,
    capitals: [['Calcutta', 22.57, 88.36]],
    summary: 'The trading company that became a ruling power, from Plassey to the revolt of 1857.',
    rulers: [
      { id: 'warren-hastings', name: 'Warren Hastings', start: 1773, end: 1785, note: 'The first Governor-General.' },
      { id: 'wellesley', name: 'Lord Wellesley', start: 1798, end: 1805, note: 'Destroyed Tipu, bound the princes by subsidiary alliances and broke the Marathas.' },
      { id: 'dalhousie', name: 'Lord Dalhousie', start: 1848, end: 1856, note: 'Annexed the Punjab and Awadh; brought railways and the telegraph.' },
    ],
  },
  {
    id: 'british-raj', name: 'British Crown', lane: 'east', start: 1858, end: 1947,
    capitals: [['Calcutta', 22.57, 88.36, 1858, 1911], ['New Delhi', 28.61, 77.21, 1911, 1947]],
    summary: 'India ruled by the Crown through a Viceroy, beside some 565 princely states.',
    built: ['csmt', 'cellular-jail', 'gateway-of-india', 'old-parliament-house', 'rashtrapati-bhavan', 'india-gate'],
    rulers: [
      { id: 'canning', name: 'Lord Canning', start: 1858, end: 1862, note: 'The first Viceroy, after the revolt of 1857.' },
      { id: 'curzon', name: 'Lord Curzon', start: 1899, end: 1905, note: 'Partitioned Bengal and proposed the Victoria Memorial; restored the Taj Mahal.', built: ['victoria-memorial'] },
      { id: 'hardinge', name: 'Lord Hardinge', start: 1910, end: 1916, note: 'Moved the capital from Calcutta to Delhi in 1911.' },
      { id: 'mountbatten', name: 'Lord Mountbatten', start: 1947, end: 1947, note: 'The last Viceroy, who brought forward the date of independence.' },
    ],
  },
];

// The dynasties whose span holds a year, in lane order.
export const reigningAt = (year) => {
  const order = LANES.map((l) => l.id);
  return DYNASTIES.filter((d) => d.start <= year && year <= d.end).sort((a, b) => order.indexOf(a.lane) - order.indexOf(b.lane) || a.start - b.start);
};

// Capitals in use in a year.
export const capitalsAt = (year) => {
  const out = [];
  for (const d of DYNASTIES) {
    if (year < d.start || year > d.end) continue;
    for (const [name, lat, lng, from = d.start, to = d.end] of d.capitals) {
      if (from <= year && year <= to) out.push({ name, lat, lng, dynasty: d });
    }
  }
  return out;
};

export const RULERS = DYNASTIES.flatMap((d) => d.rulers.map((r) => ({ ...r, dynasty: d })));
