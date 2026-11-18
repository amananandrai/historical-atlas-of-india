// Guided tours: short stories told a step at a time, each step a year on the map and a few lines of text.
// `open` links a step to an item of the atlas (an address such as 'ruler/ashoka'); `layers` switches
// map layers on for the step. Each tour opens at #tour/<id> and each step at #tour/<id>/<n> (from 1).
// `node tools/check-atlas.mjs` checks that every link goes somewhere real.

export const TOURS = [
  {
    id: 'first-empire', name: 'The first empire',
    summary: 'How Magadha grew into the Maurya empire, and how Ashoka turned from war to the dhamma.',
    steps: [
      { year: -460, title: 'Magadha rises', text: 'Of the sixteen great states of the Ganga plain, Magadha, with its iron and elephants, swallows its neighbours. Ajatashatru fortifies a village on the Ganga that becomes Pataliputra.', open: 'ruler/ajatashatru' },
      { year: -326, title: 'Alexander at the Hydaspes', text: 'Alexander defeats Porus on the Jhelum, but his army will go no further than the Beas. The Nandas rule the plain beyond.', open: 'battle/hydaspes', layers: ['battles'] },
      { year: -302, title: 'Chandragupta’s empire', text: 'Chandragupta Maurya has overthrown the Nandas and taken the north-west from Seleucus. The Greek envoy Megasthenes comes to Pataliputra and describes its walls and officials.', open: 'traveller/megasthenes', layers: ['travellers'] },
      { year: -261, title: 'The Kalinga war', text: 'Ashoka conquers Kalinga. A hundred thousand die, by his own count, and the king turns to the dhamma.', open: 'battle/kalinga', layers: ['battles'] },
      { year: -250, title: 'Ashoka’s edicts', text: 'Edicts carved on rocks and pillars from Kandahar to Karnataka mark the widest empire India would see for two thousand years. Roads of the Uttarapatha and Dakshinapatha bind it together.', open: 'ruler/ashoka', layers: ['trade'] },
      { year: -250, title: 'The Lion Capital', text: 'Polished stone pillars crowned with animals: the Lion Capital at Sarnath is now India’s national emblem.', open: 'art/mauryan', layers: ['art'] },
      { year: -185, title: 'The end of the Mauryas', text: 'The last Maurya is killed by his general Pushyamitra Shunga, and the empire breaks into regional kingdoms.', open: 'ruler/pushyamitra-shunga' },
    ],
  },
  {
    id: 'pilgrims', name: 'Pilgrims’ India',
    summary: 'The Buddhist world of north India through the eyes of two Chinese monks, three centuries apart.',
    steps: [
      { year: -250, title: 'Sanchi', text: 'Ashoka builds the first stupas over the Buddha’s relics. Their gateways, carved later, tell his life without ever showing him.', open: 'art/early-buddhist', layers: ['art'] },
      { year: 127, title: 'Kanishka and the Silk Road', text: 'Under the Kushans, the passes of the north-west join India to the Silk Road, and Buddhism begins its journey to China.', open: 'route/silk-road', layers: ['trade'] },
      { year: 405, title: 'Faxian walks to India', text: 'Faxian crosses the mountains to find the monastic rules. He finds the Gupta lands peaceful, with free hospitals at Pataliputra.', open: 'traveller/faxian', layers: ['travellers'] },
      { year: 450, title: 'The Gupta Buddha', text: 'At Sarnath and Mathura, sculptors give the Buddha the calm, inward face that becomes the model across Asia.', open: 'art/gupta-sculpture', layers: ['art'] },
      { year: 637, title: 'Xuanzang at Nalanda', text: 'Xuanzang studies at Nalanda, where thousands of monks learn logic, grammar and medicine as well as the Buddha’s teaching.', open: 'traveller/xuanzang', layers: ['travellers'] },
      { year: 643, title: 'Harsha’s assembly', text: 'Harsha holds a great assembly at Kannauj in Xuanzang’s honour, and then a gift-giving at Prayag where he gives away all he has.', open: 'ruler/harsha' },
      { year: 800, title: 'The Palas', text: 'The Pala kings of Bengal and Bihar are the last great patrons of Buddhism in India; Vikramashila and Nalanda send teachers to Tibet.', open: 'dynasty/pala', layers: ['art'] },
    ],
  },
  {
    id: 'temple-builders', name: 'Temple builders of the south',
    summary: 'A thousand years of temples, from the rock-cut shrines of the Pallavas to the towering gateways of Madurai.',
    steps: [
      { year: 650, title: 'Mamallapuram', text: 'The Pallavas carve whole boulders into temples and a cliff into the Descent of the Ganga, and later build the Shore Temple in stone.', open: 'art/pallava-sculpture', layers: ['art'] },
      { year: 760, title: 'Ellora', text: 'The Rashtrakutas cut the Kailasa temple out of a hillside from the top down: a whole temple carved, not built.', open: 'style/rashtrakuta' },
      { year: 1010, title: 'Thanjavur', text: 'Rajaraja Chola completes the Brihadeeswara temple, its vimana the tallest of its day, and its walls painted inside.', open: 'ruler/rajaraja-i' },
      { year: 1025, title: 'Across the sea', text: 'Rajendra Chola sends his fleet across the Bay of Bengal against Srivijaya. Indian merchants and gods have long gone the same way.', open: 'route/bay-of-bengal', layers: ['trade'] },
      { year: 1117, title: 'Belur', text: 'The Hoysalas carve soft soapstone like ivory, with dancers on the brackets of the Chennakeshava temple.', open: 'art/hoysala-sculpture', layers: ['art'] },
      { year: 1520, title: 'Vijayanagara', text: 'Under Krishnadevaraya, Domingo Paes finds a city as large as Rome, with markets of gems and the Vittala temple rising.', open: 'traveller/domingo-paes', layers: ['travellers'] },
      { year: 1630, title: 'Madurai', text: 'The Nayaks rebuild the Meenakshi temple as a city of its own, behind gopurams painted with hundreds of figures.', open: 'ruler/thirumalai-nayak' },
    ],
  },
  {
    id: 'mughals-to-company', name: 'From the Mughals to the Company',
    summary: 'How a Central Asian prince founded an empire, and how a trading company took it over.',
    steps: [
      { year: 1526, title: 'Panipat', text: 'Babur’s guns and cavalry defeat Ibrahim Lodi. The Mughal empire begins.', open: 'battle/panipat-1', layers: ['battles'] },
      { year: 1540, title: 'Sher Shah’s road', text: 'Sher Shah drives out Humayun, reforms the revenue, and rebuilds the Grand Trunk Road from Bengal to the Indus.', open: 'route/grand-trunk-road', layers: ['trade'] },
      { year: 1600, title: 'Akbar’s empire', text: 'Akbar rules from Kabul to the Deccan through alliances with the Rajputs and a single system of ranks and revenue. His painters make a new art.', open: 'ruler/akbar', layers: ['art'] },
      { year: 1616, title: 'An English embassy', text: 'Sir Thomas Roe follows Jahangir’s court for three years to win trading rights at Surat for a small English company.', open: 'traveller/thomas-roe', layers: ['travellers'] },
      { year: 1665, title: 'Bernier’s Mughal empire', text: 'Aurangzeb has won the war of succession. The French doctor Bernier travels with him to Kashmir and writes the account Europe will read.', open: 'traveller/bernier', layers: ['travellers'] },
      { year: 1707, title: 'Aurangzeb dies', text: 'After decades of war in the Deccan, the empire is at its widest and most strained. Within a generation the Marathas, the Nizam and Awadh go their own way.', open: 'ruler/aurangzeb' },
      { year: 1757, title: 'Plassey', text: 'Robert Clive wins Bengal by a plot in the Nawab’s camp. The Company becomes a ruler.', open: 'battle/plassey', layers: ['battles'] },
      { year: 1857, title: 'The revolt', text: 'The Company’s sepoys rise; Delhi is besieged and retaken, the last Mughal is exiled, and the Crown takes over India.', open: 'battle/delhi-1857', layers: ['battles'] },
    ],
  },
];
