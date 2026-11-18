// Travellers' journeys and trade routes, for the travellers and trade layers. Years below zero are BCE;
// `c: true` marks rough dates. A traveller's `stops` are [place, lat, lng] in the order of the journey
// as far as it is known (several wandered back and forth; the line joins the places they wrote about);
// `start` and `end` are the years spent in India. A trade route's `paths` are lines of [place, lat, lng];
// a place whose name starts with "to " is where a route leaves the map, and one starting "off ", "Bay of"
// or "Gulf of" is a point at sea that keeps a sea lane off the land; neither gets a dot on the map.
// `dynasties` link to js/atlas/dynasties.js. `node tools/check-atlas.mjs` checks the dates and places.
//
// Sources: the travellers' own accounts in standard translations (J. W. McCrindle, Ancient India as
// Described by Megasthenes and Arrian, 1877; James Legge, A Record of Buddhistic Kingdoms, 1886;
// Samuel Beal, Si-Yu-Ki, 1884; E. C. Sachau, Alberuni's India, 1888; H. A. R. Gibb, The Travels of Ibn
// Battuta, 1958–2000; R. H. Major, India in the Fifteenth Century, 1857; Robert Sewell, A Forgotten
// Empire, 1900; William Foster, The Embassy of Sir Thomas Roe, 1899; Archibald Constable, Bernier's
// Travels, 1891); and for the routes, the Periplus of the Erythraean Sea (trans. Lionel Casson, 1989)
// and the general histories named in dynasties.js.

export const TRAVELLERS = [
  {
    id: 'megasthenes', name: 'Megasthenes', from: 'Greek envoy of Seleucus I', start: -302, end: -288, c: true,
    account: 'Indica (lost; known from quotations in Arrian, Strabo and Diodorus)',
    summary: 'Sent by Seleucus to the court of Chandragupta Maurya, he described Pataliputra’s timber walls, the king’s officials and the “seven castes” of Indian society.',
    stops: [['Arachosia (Kandahar)', 31.61, 65.71], ['Taxila', 33.75, 72.82], ['Mathura', 27.49, 77.67], ['Pataliputra', 25.61, 85.14]],
    dynasties: ['maurya'],
  },
  {
    id: 'faxian', name: 'Faxian', from: 'Chinese Buddhist monk', start: 399, end: 412, c: true,
    account: 'Foguoji, A Record of Buddhist Kingdoms',
    summary: 'Walked from China to find complete copies of the monastic rules; he found the Gupta lands peaceful and prosperous, and sailed home by way of Sri Lanka.',
    stops: [['Peshawar', 34.01, 71.58], ['Taxila', 33.75, 72.82], ['Mathura', 27.49, 77.67], ['Sankisa', 27.33, 79.27], ['Shravasti', 27.52, 82.05], ['Kapilavastu', 27.54, 83.06], ['Kushinagar', 26.74, 83.89], ['Vaishali', 25.99, 85.13], ['Pataliputra', 25.61, 85.14], ['Rajagriha', 25.03, 85.42], ['Bodh Gaya', 24.7, 84.99], ['Sarnath', 25.38, 83.02], ['Tamralipti', 22.3, 87.92], ['Anuradhapura', 8.31, 80.4]],
    dynasties: ['gupta'],
  },
  {
    id: 'xuanzang', name: 'Xuanzang', from: 'Chinese Buddhist monk', start: 630, end: 645,
    account: 'Da Tang Xiyu Ji, the Great Tang Records of the Western Regions (646)',
    summary: 'Spent fifteen years in India, studied at Nalanda, and was honoured by Harsha at Kannauj; his record describes over a hundred kingdoms and is still used to find lost sites.',
    stops: [['Kapisa', 34.95, 69.27], ['Peshawar', 34.01, 71.58], ['Taxila', 33.75, 72.82], ['Kashmir', 34.08, 74.8], ['Mathura', 27.49, 77.67], ['Kannauj', 27.05, 79.92], ['Prayag', 25.44, 81.85], ['Sarnath', 25.38, 83.02], ['Vaishali', 25.99, 85.13], ['Bodh Gaya', 24.7, 84.99], ['Nalanda', 25.14, 85.44], ['Kamarupa', 26.14, 91.74], ['Tamralipti', 22.3, 87.92], ['Kanchipuram', 12.83, 79.7], ['Maharashtra (Pulakeshin II)', 19.9, 75.3], ['Valabhi', 21.89, 71.88], ['Nalanda', 25.14, 85.44], ['Kannauj', 27.05, 79.92], ['Taxila', 33.75, 72.82]],
    dynasties: ['pushyabhuti', 'badami-chalukya', 'pallava'],
  },
  {
    id: 'al-biruni', name: 'Al-Biruni', from: 'Khwarazmian scholar', start: 1017, end: 1030, c: true,
    account: 'Kitab al-Hind, the Book of India (1030)',
    summary: 'Came with Mahmud of Ghazni’s armies, learned Sanskrit, and wrote the first great study of Indian science, religion and society; at Nandana he measured the size of the Earth.',
    stops: [['Ghazni', 33.55, 68.42], ['Peshawar', 34.01, 71.58], ['Nandana', 32.72, 73.27], ['Lahore', 31.55, 74.34], ['Multan', 30.2, 71.47]],
    dynasties: ['ghaznavid'],
  },
  {
    id: 'marco-polo', name: 'Marco Polo', from: 'Venetian merchant', start: 1292, end: 1293, c: true,
    account: 'The Travels (Il Milione, c. 1300)',
    summary: 'Sailed home from China along the coasts of India, and described the pearl fisheries of the Pandya coast, the pepper of Malabar and the horses shipped in from Arabia.',
    stops: [['Sri Lanka', 7.0, 80.6], ['Kayal (Pandya coast)', 8.64, 78.12], ['Kollam', 8.89, 76.61], ['off Malabar', 12.0, 74.4], ['Thane', 19.2, 72.97], ['Khambhat', 22.31, 72.62], ['to Hormuz', 25.3, 58.3]],
  },
  {
    id: 'ibn-battuta', name: 'Ibn Battuta', from: 'Moroccan traveller', start: 1333, end: 1347,
    account: 'The Rihla (1355)',
    summary: 'Served Muhammad bin Tughluq as a judge at Delhi for seven years, was sent as his envoy to China, lost everything off the Malabar coast, and went on by the Maldives, Sri Lanka and Bengal.',
    stops: [['Indus crossing', 26.0, 68.0], ['Multan', 30.2, 71.47], ['Delhi', 28.65, 77.23], ['Gwalior', 26.23, 78.17], ['Chanderi', 24.72, 78.14], ['Daulatabad', 19.94, 75.21], ['Khambhat', 22.31, 72.62], ['Calicut', 11.25, 75.78], ['Male', 4.17, 73.51], ['Sri Lanka', 7.0, 80.6], ['Madurai', 9.92, 78.12], ['off the Coromandel coast', 11.5, 80.6], ['Bay of Bengal', 18.0, 89.0], ['Chittagong', 22.34, 91.81], ['Sylhet', 24.9, 91.87], ['Sonargaon', 23.65, 90.6]],
    dynasties: ['tughlaq', 'bengal-sultanate'],
  },
  {
    id: 'abdur-razzaq', name: 'Abdur Razzaq', from: 'Persian envoy of Shah Rukh', start: 1442, end: 1443,
    account: 'Matla-us-Sadain',
    summary: 'Envoy from Herat to the Zamorin of Calicut and then to Deva Raya II at Vijayanagara, whose city he thought the like of which “the eye has not seen”.',
    stops: [['to Hormuz', 25.3, 58.3], ['Calicut', 11.25, 75.78], ['off Malabar', 12.0, 74.6], ['Mangalore', 12.87, 74.84], ['Vijayanagara', 15.33, 76.46]],
    dynasties: ['vijayanagara'],
  },
  {
    id: 'vasco-da-gama', name: 'Vasco da Gama', from: 'Portuguese navigator', start: 1498, end: 1498,
    account: 'Roteiro, the anonymous journal of the first voyage',
    summary: 'Guided across the Arabian Sea from Malindi, he reached Calicut in May 1498: the first European to sail to India round Africa.',
    stops: [['to Malindi', 8.0, 58.3], ['Calicut', 11.25, 75.78], ['Anjediva', 14.76, 74.11], ['to Malindi', 8.0, 58.3]],
  },
  {
    id: 'domingo-paes', name: 'Domingo Paes', from: 'Portuguese merchant', start: 1520, end: 1522, c: true,
    account: 'Chronicle, in Robert Sewell, A Forgotten Empire',
    summary: 'Saw Vijayanagara at its height under Krishnadevaraya: its markets, the Mahanavami festival and a city “as large as Rome”.',
    stops: [['Goa', 15.5, 73.83], ['Bhatkal', 13.99, 74.56], ['Vijayanagara', 15.33, 76.46]],
    dynasties: ['vijayanagara'],
  },
  {
    id: 'thomas-roe', name: 'Sir Thomas Roe', from: 'English ambassador of James I', start: 1615, end: 1619,
    account: 'Journal of the Embassy',
    summary: 'Followed Jahangir’s court for three years to win trading rights for the East India Company at Surat.',
    stops: [['Surat', 21.17, 72.83], ['Burhanpur', 21.31, 76.23], ['Ajmer', 26.45, 74.64], ['Mandu', 22.36, 75.39], ['Ahmedabad', 23.03, 72.58], ['Surat', 21.17, 72.83]],
    dynasties: ['mughal', 'east-india-company'],
  },
  {
    id: 'bernier', name: 'François Bernier', from: 'French physician', start: 1658, end: 1669,
    account: 'Travels in the Mogul Empire (1670)',
    summary: 'Arrived as Shah Jahan’s sons fought for the throne, served a Mughal noble, travelled with Aurangzeb to Kashmir, and wrote an account of the empire read across Europe.',
    stops: [['Surat', 21.17, 72.83], ['Agra', 27.18, 78.02], ['Delhi', 28.65, 77.23], ['Lahore', 31.55, 74.34], ['Kashmir', 34.08, 74.8], ['Delhi', 28.65, 77.23], ['Bengal (Dhaka)', 23.71, 90.41]],
    dynasties: ['mughal'],
  },
];

export const ROUTES = [
  {
    id: 'uttarapatha', name: 'Uttarapatha, the northern road', kind: 'land', start: -600, end: 1540, c: true,
    summary: 'The great road of the north, from Gandhara down the Ganga plain to the ports of Bengal; the Mauryas planted it with trees and wells.',
    goods: 'Horses from the north-west; cloth, salt, spices and grain along the plain',
    paths: [[['Pushkalavati', 34.15, 71.73], ['Taxila', 33.75, 72.82], ['Sakala', 32.49, 74.53], ['Thanesar', 29.97, 76.83], ['Indraprastha', 28.61, 77.24], ['Mathura', 27.49, 77.67], ['Kaushambi', 25.34, 81.39], ['Varanasi', 25.32, 83.0], ['Pataliputra', 25.61, 85.14], ['Champa', 25.25, 87.0], ['Tamralipti', 22.3, 87.92]]],
    dynasties: ['maurya', 'kushan', 'gupta'],
  },
  {
    id: 'dakshinapatha', name: 'Dakshinapatha, the southern road', kind: 'land', start: -600, end: 1300, c: true,
    summary: 'The road to the Deccan, from the Ganga plain by Vidisha and Ujjain across the Narmada to the Satavahana cities, with a branch to the port of Bharuch.',
    goods: 'Gems, cotton, ivory and spices to the north; the trade of the western ports',
    paths: [
      [['Kaushambi', 25.34, 81.39], ['Vidisha', 23.53, 77.81], ['Ujjain', 23.18, 75.78], ['Maheshwar', 22.18, 75.59], ['Paithan', 19.48, 75.38], ['Ter', 18.32, 76.14], ['Amaravati', 16.57, 80.36]],
      [['Ujjain', 23.18, 75.78], ['Bharuch', 21.7, 72.98]],
    ],
    dynasties: ['maurya', 'satavahana', 'western-satraps'],
  },
  {
    id: 'silk-road', name: 'Silk Road links', kind: 'land', start: -100, end: 1400, c: true,
    summary: 'The passes that tied India to the Silk Road: over the Hindu Kush from Bactria, and up the Indus gorges to Kashgar. Buddhism went out by them to Central Asia and China.',
    goods: 'Silk and horses in; cotton, spices, gems, texts and monks out',
    paths: [
      [['Balkh', 36.76, 66.9], ['Bamiyan', 34.82, 67.83], ['Kapisa', 34.95, 69.27], ['Peshawar', 34.01, 71.58], ['Taxila', 33.75, 72.82]],
      [['Taxila', 33.75, 72.82], ['Chilas', 35.42, 74.1], ['Gilgit', 35.92, 74.31], ['Tashkurgan', 37.77, 75.23], ['Kashgar', 39.47, 75.99]],
    ],
    dynasties: ['kushan', 'indo-greek'],
  },
  {
    id: 'monsoon-rome', name: 'The monsoon route to Rome', kind: 'sea', start: -50, end: 400, c: true,
    summary: 'Once Greek sailors learned to ride the monsoon, fleets crossed from the Red Sea to Barygaza and Muziris each summer, and came back with the winter winds.',
    goods: 'Pepper, pearls, cotton, gems and ivory out; Roman gold coins, wine and glass in',
    paths: [
      [['to the Red Sea', 13.0, 58.3], ['Barygaza (Bharuch)', 21.7, 72.98]],
      [['to the Red Sea', 13.0, 58.3], ['Muziris', 10.17, 76.21], ['off Kerala', 9.0, 76.0], ['off Kanyakumari', 7.6, 77.4], ['off Sri Lanka', 5.6, 80.5], ['off Sri Lanka', 8.0, 82.2], ['Arikamedu', 11.9, 79.85]],
    ],
    dynasties: ['satavahana', 'western-satraps'],
  },
  {
    id: 'bay-of-bengal', name: 'Across the Bay of Bengal', kind: 'sea', start: 1, end: 1500, c: true,
    summary: 'From the ports of Kalinga, Bengal and the Tamil coast to Burma, Sumatra and Java: the route that carried Indian scripts, gods and temples to Southeast Asia, and the Chola fleet to Srivijaya in 1025.',
    goods: 'Cloth, beads and spices out; gold, tin, camphor and sandalwood in',
    paths: [
      [['Tamralipti', 22.3, 87.92], ['Bay of Bengal', 18.0, 90.0], ['Pathein', 16.78, 94.73], ['to the Malay coast', 8.0, 98.0]],
      [['Palur', 19.46, 85.18], ['Bay of Bengal', 14.0, 90.0], ['to the Malay coast', 8.0, 98.0]],
      [['Nagapattinam', 10.77, 79.84], ['Bay of Bengal', 9.0, 86.0], ['to Sumatra', 5.8, 95.0]],
    ],
    dynasties: ['pala', 'chola', 'eastern-ganga'],
  },
  {
    id: 'malabar-spice', name: 'The spice ports of the Arabian Sea', kind: 'sea', start: 700, end: 1500, c: true,
    summary: 'Arab, Persian, Gujarati and Jewish merchants carried Malabar’s pepper and Gujarat’s cloth to Hormuz and Aden, and horses back for the armies of the Deccan.',
    goods: 'Pepper, ginger, cloth and indigo out; horses, silver and dates in',
    paths: [
      [['to Hormuz', 25.3, 58.3], ['Khambhat', 22.31, 72.62], ['Thane', 19.2, 72.97], ['Goa', 15.5, 73.83], ['Calicut', 11.25, 75.78], ['Kollam', 8.89, 76.61]],
      [['to Aden', 12.5, 58.3], ['Calicut', 11.25, 75.78]],
    ],
    dynasties: ['chaulukya', 'gujarat-sultanate', 'vijayanagara'],
  },
  {
    id: 'cape-route', name: 'The Cape route', kind: 'sea', start: 1498, end: 1869,
    summary: 'The Portuguese, then the Dutch, English and French, sailed round Africa to Goa, Surat, Madras and Calcutta, until the Suez Canal opened in 1869.',
    goods: 'Pepper, cotton cloth, indigo, saltpetre and later tea and opium out; silver in',
    paths: [
      [['to the Cape', 6.0, 58.3], ['Goa', 15.5, 73.83], ['Surat', 21.17, 72.83]],
      [['to the Cape', 6.0, 58.3], ['off Sri Lanka', 5.5, 80.5], ['off Sri Lanka', 7.0, 82.3], ['Madras', 13.08, 80.29], ['Calcutta', 22.57, 88.36]],
    ],
    dynasties: ['east-india-company'],
  },
  {
    id: 'grand-trunk-road', name: 'Grand Trunk Road', kind: 'land', start: 1540, end: 2026,
    summary: 'Sher Shah rebuilt the old northern road from Bengal to the Indus with sarais and wells; the Mughals and then the British extended it from Kabul to Calcutta.',
    goods: 'Armies, mail, pilgrims and the trade of the whole north',
    paths: [[['Kabul', 34.53, 69.17], ['Peshawar', 34.01, 71.58], ['Rawalpindi', 33.6, 73.05], ['Lahore', 31.55, 74.34], ['Amritsar', 31.63, 74.87], ['Delhi', 28.65, 77.23], ['Agra', 27.18, 78.02], ['Allahabad', 25.44, 81.85], ['Varanasi', 25.32, 83.0], ['Sasaram', 24.95, 84.03], ['Calcutta', 22.57, 88.36]]],
    dynasties: ['sur', 'mughal', 'british-raj'],
  },
];

export const routesOf = (id) => ({
  travellers: TRAVELLERS.filter((t) => (t.dynasties || []).includes(id)),
  routes: ROUTES.filter((r) => (r.dynasties || []).includes(id)),
});
