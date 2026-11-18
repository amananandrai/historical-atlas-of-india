// The sources of the atlas, for its #sources page. Each says what it is used for, with links into the
// atlas (`at`: addresses such as '1605' or 'style/mughal'), and under what terms. Keep this list in step
// with the sources named in tools/build-timeline-map.py, tools/plates/, js/timeline-data.js and js/atlas/.

export const SOURCES = [
  {
    group: 'Maps',
    items: [
      {
        id: 'joppen', cite: 'Charles Joppen, Historical Atlas of India, for the Use of High Schools, Colleges and Private Students. Longmans, Green & Co., 1914; printed by Justus Perthes, Gotha.',
        url: 'https://archive.org/details/historicalatlaso00jopprich', terms: 'Public domain',
        use: 'Traced: India in 1022 (map 10), 1318 (map 12), 1398 (map 13), 1525 (map 14), 1751 (map 23), 1795 (map 27), 1823 (map 29) and 1856 (map 31), and the princely states of “The Indian Empire in 1914” (map 33). Checked against: Ancient Aryan India, Alexander in 326 BC, India in the 2nd century, India in 1605 and India in 1805.',
        at: [['1022', 'India in 1022'], ['1318', 'India in 1318'], ['1398', 'India in 1398'], ['1500', 'India in 1525'], ['1751', 'India in 1751'], ['1795', 'India in 1795'], ['1823', 'India in 1823'], ['1856', 'India in 1856'], ['1939', '1939']],
      },
      {
        id: 'davies', cite: 'C. Collin Davies, An Historical Atlas of the Indian Peninsula. Oxford University Press, 1949.',
        terms: 'Followed by eye; nothing copied',
        use: 'The borders of the Mauryas (250 BCE), the Guptas (c. 400), the Delhi Sultanate (1236) and the Mughals (1605), and the places of the sixteen great states.',
        at: [['-250', 'Mauryas'], ['400', 'Guptas'], ['1236', '1236'], ['1605', '1605']],
      },
      {
        id: 'datameet', cite: 'DataMeet India community, India district boundaries, Census 2011.',
        url: 'https://github.com/datameet/maps', terms: 'CC BY 4.0',
        use: 'Joined into the provinces and states of 1939, 1947, 1950 and 1956, and today’s states and union territories.',
        at: [['1947', '1947'], ['1950', '1950'], ['1956', '1956'], ['2026', 'Today']],
      },
      {
        id: 'natural-earth', cite: 'Natural Earth, 1:50m land and rivers; 1:10m countries (India’s point of view) and first-level divisions.',
        url: 'https://www.naturalearthdata.com', terms: 'Public domain',
        use: 'The land and rivers under every map; India’s boundary today; Pakistan, Bangladesh and Kashmir in the maps from 1939 on.',
      },
    ],
  },
  {
    group: 'Inscriptions and early texts',
    note: 'The evidence that the borders of the early eras rest on, read in standard editions and translations.',
    items: [
      { id: 'rigveda', cite: 'Rigveda 10.75 (the river hymn) and the Shatapatha Brahmana (Videgha Mathava and the Sadanira).', use: 'The lands of the Vedic texts.', at: [['-1000', 'Vedic period']] },
      { id: 'arrian', cite: 'Arrian, Anabasis of Alexander; the Greek accounts of the Prasii and Gangaridai.', use: 'Alexander’s conquests and the Nanda realm, c. 325 BCE.', at: [['-325', 'c. 325 BCE']] },
      { id: 'ashoka', cite: 'The rock and pillar edicts of Ashoka.', use: 'The reach of the Maurya empire, checked against Davies’ map.', at: [['-250', '250 BCE']] },
      { id: 'hathigumpha', cite: 'The Hathigumpha inscription of Kharavela, Udayagiri.', use: 'A Nanda presence in Kalinga.', at: [['-325', 'c. 325 BCE']] },
      { id: 'rabatak', cite: 'The Rabatak inscription of Kanishka (Bactrian; trans. N. Sims-Williams).', use: 'The Kushan empire to Pataliputra.', at: [['150', 'c. 150 CE'], ['ruler/kanishka', 'Kanishka']] },
      { id: 'junagadh', cite: 'The Junagadh rock inscription of Rudradaman I, 150 CE.', use: 'The lands of the Western Satraps.', at: [['150', 'c. 150 CE'], ['ruler/rudradaman', 'Rudradaman']] },
      { id: 'nasik', cite: 'The Nasik cave inscription of Gautami Balashri.', use: 'The lands of the Satavahanas.', at: [['ruler/gautamiputra-satakarni', 'Gautamiputra Satakarni']] },
      { id: 'allahabad', cite: 'The Allahabad pillar inscription of Samudragupta.', use: 'Samudragupta’s campaigns.', at: [['ruler/samudragupta', 'Samudragupta']] },
      { id: 'sulaiman', cite: 'Sulaiman the merchant, Akhbar al-Sin wa’l-Hind, 851.', use: 'The three kingdoms that fought over Kannauj, c. 850.', at: [['850', 'c. 850']] },
      { id: 'aitchison', cite: 'C. U. Aitchison, A Collection of Treaties, Engagements and Sanads Relating to India (3rd ed., 1892), as summarised in Joppen.', use: 'The treaties of 1799–1805 behind the c. 1805 map.', at: [['1805', 'c. 1805']] },
    ],
  },
  {
    group: 'Histories',
    note: 'The short histories of the eras, the dynasties and rulers, the styles and the battles are summaries of these general works; dates marked “c.” are uncertain.',
    items: [
      { id: 'majumdar', cite: 'R. C. Majumdar (ed.), The History and Culture of the Indian People. 11 vols. Bharatiya Vidya Bhavan, 1951–77.' },
      { id: 'thapar', cite: 'Romila Thapar, Early India: From the Origins to AD 1300. Penguin, 2002.' },
      { id: 'chandra', cite: 'Satish Chandra, Medieval India: From Sultanat to the Mughals. 2 vols. Har-Anand, 1997–99.' },
      { id: 'joppen-text', cite: 'The notes to each map in Joppen’s Historical Atlas of India (1914), drawing on V. A. Smith, The Early History of India, and J. Grant Duff, History of the Mahrattas.', url: 'https://archive.org/details/historicalatlaso00jopprich' },
    ],
  },
  {
    group: 'Art',
    note: 'The schools of sculpture and painting, their dates, centres and works are summaries of these surveys; where each work is now is from the holding museum’s own record. No pictures of works are shown yet: each will be taken only from a museum’s CC0 or public-domain open-access record.',
    items: [
      { id: 'harle', cite: 'J. C. Harle, The Art and Architecture of the Indian Subcontinent. 2nd ed. Yale University Press (Pelican History of Art), 1994.', use: 'The schools of sculpture, from the Indus to the Hoysalas, and the early painting.', at: [['art/gandhara', 'Gandhara'], ['art/chola-bronze', 'Chola bronzes']] },
      { id: 'dehejia', cite: 'Vidya Dehejia, Indian Art. Phaidon (Art & Ideas), 1997.', use: 'The outline of the schools and their dates.', at: [['art', 'Sculpture and painting']] },
      { id: 'goswamy', cite: 'B. N. Goswamy, The Spirit of Indian Painting: Close Encounters with 101 Great Works, 1100–1900. Penguin, 2014.', use: 'The schools of painting, from the Jain manuscripts to Company painting, and their painters.', at: [['art/pahari', 'Pahari'], ['art/mughal-painting', 'Mughal']] },
    ],
  },
  {
    group: 'Monuments',
    items: [
      {
        id: 'monuments', cite: 'Monuments of India: 101 monuments modelled in 3D, with their dates, places and styles.',
        url: 'https://monuments-of-india-nu.vercel.app', terms: 'MIT; data from js/data.js of its repository',
        use: 'Every monument pin, its year and the pictures of monuments and of building parts in the glossary.',
        at: [['glossary', 'Glossary'], ['styles', 'Styles']],
      },
    ],
  },
];

// Not used, and why: so a reader knows what has not been checked yet.
export const NOT_YET = [
  'Joseph E. Schwartzberg (ed.), A Historical Atlas of South Asia (1978; 2nd impr. 1992), the standard modern atlas. Its maps are under copyright and its online copy could not be reached when the maps were drawn; the early maps should be checked against it.',
  'Field surveys and excavation reports for the Harappan and Vedic maps, which follow the commonly cited limiting sites rather than a site gazetteer.',
];

export const ISSUES = 'https://github.com/amananandrai/historical-atlas-of-india/issues';
