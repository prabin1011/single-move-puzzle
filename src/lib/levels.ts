
import { PlaceHolderImages } from './placeholder-images';
import { generateHint } from './hint-engine';

export interface Level {
  id: string;
  place: string;
  country: string;
  facts: string[][]; // Facts are now a nested array
  category: 'architecture' | 'nature' | 'sky' | 'city' | 'interior' | 'abstract';
  visualComplexity: 'low' | 'medium' | 'high';
  imageId: string; 
  variations: number;
}

const allLevels: Level[] = [
  // 5 Easy Levels (3x3)
  {
    id: 'lvl_001',
    place: 'Eiffel Tower',
    country: 'France',
    facts: [
        ["It was the main exhibit of the 1889 Exposition Universelle (World's Fair).", "The tower's iron structure weighs 7,300 tons.", 'It is the most-visited paid monument in the world.'],
        ["The tower is repainted every seven years, a process that requires 60 tons of paint.", "Its height varies by up to 15 cm (6 in) due to temperature changes.", "The names of 72 French scientists, engineers, and mathematicians are engraved on the tower."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'eiffel-tower',
    variations: 4,
  },
  {
    id: 'lvl_002',
    place: 'Colosseum',
    country: 'Italy',
    facts: [
        ["It's the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today.", 'The hypogeum, an underground network of tunnels, was added later to house gladiators and animals.', "It's estimated that over 400,000 people and 1 million animals died within its walls."],
        ["The Colosseum could hold an estimated 50,000 to 80,000 spectators.", "It was used for gladiatorial contests and public spectacles such as mock sea battles.", "The southern side of the Colosseum collapsed during a major earthquake in 1349."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'colosseum',
    variations: 4,
  },
  {
    id: 'lvl_003',
    place: 'Mount Fuji',
    country: 'Japan',
    facts: [
        ['It is an active volcano that last erupted in 1707.', "It is one of Japan's 'Three Holy Mountains' along with Mount Tate and Mount Haku.", 'On clear days, it can be seen from Tokyo, about 100 kilometers away.'],
        ["Women were forbidden to climb to the summit until 1868.", "The first known ascent by a foreigner was by Sir Rutherford Alcock in September 1868.", "It is surrounded by five lakes: Lake Kawaguchi, Lake Yamanaka, Lake Sai, Lake Motosu and Lake Shoji."]
    ],
    category: 'nature',
    visualComplexity: 'low',
    imageId: 'mount-fuji',
    variations: 4,
  },
  {
    id: 'lvl_004',
    place: 'Santorini',
    country: 'Greece',
    facts: [
        ['The island is the site of one of the largest volcanic eruptions in recorded history.', 'The iconic white and blue buildings are built on the edge of a caldera.', 'Many of the houses are carved into the cliffs.'],
        ["The island was once a single circular island named Strongyli, meaning 'the round one'.", "The official name of Santorini is Thira.", "Santorini has a small but flourishing wine industry."]
    ],
    category: 'city',
    visualComplexity: 'medium',
    imageId: 'santorini',
    variations: 4,
  },
  {
    id: 'lvl_005',
    place: 'Northern Lights',
    country: 'Various',
    facts: [
        ["Also known as Aurora Borealis, they are caused by collisions between electrically charged particles from the sun that enter the Earth's atmosphere.", 'The colors can vary, with green being the most common, followed by pink.', "The best places to see them are in the 'auroral zone', which includes parts of Iceland, Norway, and Canada."],
        ["The name 'Aurora Borealis' was coined by Galileo in 1619.", "Auroras also occur on other planets, including Jupiter, Saturn, Uranus, and Neptune.", "Ancient folklore attributed the lights to dancing spirits or battles between gods."]
    ],
    category: 'sky',
    visualComplexity: 'low',
    imageId: 'northern-lights',
    variations: 2,
  },
  {
    id: 'lvl_006',
    place: 'Statue of Liberty',
    country: 'USA',
    facts: [
        ["The statue's copper skin turned its characteristic green color due to oxidation over about 30 years.", 'It functioned as a lighthouse from 1886 to 1901.', 'The seven spikes on the crown represent the seven oceans and continents.'],
        ["The statue was a gift to the United States from the people of France in 1886.", "The statue's face is said to be modeled after the sculptor's mother.", "The statue's official name is 'Liberty Enlightening the World'."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'statue-of-liberty',
    variations: 4,
  },
  {
    id: 'lvl_007',
    place: 'Taj Mahal',
    country: 'India',
    facts: [
        ['It is a perfectly symmetrical building.', 'The four minarets are slightly tilted outwards to protect the main tomb from collapse.', 'Over 1,000 elephants were used to transport building materials.'],
        ["It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.", "The entire mausoleum is made of white marble.", "The complex also includes a mosque, a guesthouse, and formal gardens."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'taj-mahal',
    variations: 4,
  },
  {
    id: 'lvl_008',
    place: 'Machu Picchu',
    country: 'Peru',
    facts: [
        ['It was built around 1450, at the height of the Inca Empire.', 'The site was abandoned just over 100 years later.', "It's constructed of dry-stone walls, where stones fit so tightly no mortar was needed."],
        ["It is often referred to as the 'Lost City of the Incas'.", "It was rediscovered in 1911 by American historian Hiram Bingham.", "The purpose of the site is still a subject of debate among archaeologists."]
    ],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'machu-picchu',
    variations: 4,
  },
  {
    id: 'lvl_009',
    place: 'Great Wall of China',
    country: 'China',
    facts: [
        ['It is not a single continuous wall but a system of defenses.', 'Sticky rice flour was used in the binding material for the bricks.', 'It is not, as is commonly believed, visible from the moon with the naked eye.'],
        ["The wall is the longest man-made structure in the world.", "Much of the wall was built during the Ming Dynasty (1368-1644).", "The wall also served as a transportation corridor and for border control."]
    ],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'great-wall-of-china',
    variations: 4,
  },
  {
    id: 'lvl_010',
    place: 'Pyramids of Giza',
    country: 'Egypt',
    facts: [
        ['The Great Pyramid was the tallest man-made structure for over 3,800 years.', "The three pyramids are precisely aligned with the stars of Orion's Belt.", 'Its construction is estimated to have involved 100,000 workers.'],
        ["The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex.", "It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.", "The pyramids were built as tombs for the pharaohs."]
    ],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'pyramids-of-giza',
    variations: 4,
  },
  {
    id: 'lvl_011',
    place: 'Christ the Redeemer',
    country: 'Brazil',
    facts: [
        ['The statue is the largest Art Deco-style sculpture in the world.', 'It has been struck by lightning multiple times.', 'The outer layers are composed of 6 million soapstone tiles.'],
        ["The statue is 30 meters (98 ft) tall, not including its 8-meter (26 ft) pedestal.", "It is located at the peak of the 700-meter (2,300 ft) Corcovado mountain.", "The statue was constructed between 1922 and 1931."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'christ-the-redeemer',
    variations: 4,
  },
  {
    id: 'lvl_012',
    place: 'Petra',
    country: 'Jordan',
    facts: [
        ["It's known as the 'Rose City' due to the color of the stone.", 'At its peak, it was a bustling trade hub.', 'Only about 15% of the city has been uncovered by archaeologists.'],
        ["Petra was established as early as 312 BC as the capital city of the Nabataeans.", "The city is famous for its rock-cut architecture and water conduit system.", "The most famous structure is Al-Khazneh (The Treasury)."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'petra',
    variations: 4,
  },
  {
    id: 'lvl_013',
    place: 'Grand Canyon',
    country: 'USA',
    facts: [
        ['The canyon is about 277 miles long, up to 18 miles wide and attains a depth of over a mile.', 'It is one of the Seven Natural Wonders of the World.', 'It was carved by the Colorado River over a period of 6 million years.'],
        ["The canyon is home to several Native American tribes.", "The canyon is known for its visually overwhelming size and its intricate and colorful landscape.", "The Grand Canyon became a national park in 1919."]
    ],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'grand-canyon',
    variations: 4,
  },
  {
    id: 'lvl_014',
    place: 'Venice Canals',
    country: 'Italy',
    facts: [
        ['The city is built on more than 100 small islands in a lagoon in the Adriatic Sea.', 'It has no roads, just canals, including the Grand Canal thoroughfare.', 'There are over 400 bridges connecting the islands.'],
        ["The traditional Venetian boat is the gondola.", "The city is slowly sinking.", "Venice and its lagoon are a UNESCO World Heritage Site."]
    ],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'venice-canals',
    variations: 4,
  },
  {
    id: 'lvl_015',
    place: 'Sydney Opera House',
    country: 'Australia',
    facts: [
        ['The design was chosen from an international competition with 233 entries.', 'The roof is covered with over 1 million tiles.', 'It has its own seawater cooling system, using water from the harbor.'],
        ["The building was formally opened by Queen Elizabeth II on 20 October 1973.", "The design is by Danish architect Jørn Utzon.", "It is one of the 20th century's most famous and distinctive buildings."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'sydney-opera-house',
    variations: 4,
  },
  {
    id: 'lvl_016',
    place: 'Burj Khalifa',
    country: 'UAE',
    facts: [
        ['It is the tallest building in the world.', 'The tip of the spire can be seen from up to 95 kilometers away.', 'It holds records for the highest observation deck and elevator with the longest travel distance.'],
        ["The building was designed by Adrian Smith, then of Skidmore, Owings & Merrill (SOM).", "The design is inspired by the spider lily, a regional desert flower.", "The building has 163 floors."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'burj-khalifa',
    variations: 4,
  },
  {
    id: 'lvl_017',
    place: 'The Louvre',
    country: 'France',
    facts: [
        ["It is the world's largest art museum.", 'The glass pyramid entrance was a controversial addition in 1989.', 'It is home to the Mona Lisa, which has its own mailbox for fan letters.'],
        ["The museum is housed in the Louvre Palace, originally built as a fortress in the late 12th to 13th century.", "The museum opened on 10 August 1793 with an exhibition of 537 paintings.", "The museum's collection is divided into eight curatorial departments."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'louvre-museum',
    variations: 4,
  },
  {
    id: 'lvl_018',
    place: 'Neuschwanstein Castle',
    country: 'Germany',
    facts: [
        ['The castle was intended as a home for King Ludwig II of Bavaria.', "It was the inspiration for Disneyland's Sleeping Beauty Castle.", 'Despite its medieval look, it was built in the 19th century and had modern technology for its time.'],
        ["The castle was opened to the public in 1886, just seven weeks after the king's death.", "The name Neuschwanstein means 'New Swan Stone'.", "The castle's design is a romanticized interpretation of a medieval knight's castle."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'neuschwanstein-castle',
    variations: 4,
  },
  {
    id: 'lvl_019',
    place: 'Angkor Wat',
    country: 'Cambodia',
    facts: [
        ['It is the largest religious monument in the world by land area.', 'It was originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire.', "It appears on Cambodia's national flag."],
        ["The name Angkor Wat means 'Temple City' or 'City of Temples' in Khmer.", "The temple is a symbol of Cambodia, appearing on its national flag.", "The temple is admired for the grandeur and harmony of the architecture, its extensive bas-reliefs, and for the numerous devatas (guardian spirits) adorning its walls."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'angkor-wat',
    variations: 4,
  },
  {
    id: 'lvl_020',
    place: 'London Eye',
    country: 'UK',
    facts: [
        ['It is the most popular paid tourist attraction in the United Kingdom.', 'The 32 capsules are numbered 1 to 33, skipping number 13 for good luck.', "It was the world's tallest Ferris wheel when it opened in 2000."],
        ["The Eye was formally opened by then Prime Minister Tony Blair on 31 December 1999.", "The wheel rotates at 26 cm (10 in) per second.", "A ride on the Eye takes about 30 minutes."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'london-eye',
    variations: 4,
  },
  {
    id: 'lvl_021',
    place: 'Hagia Sophia',
    country: 'Turkey',
    facts: [
        ["It was the world's largest cathedral for nearly a thousand years.", 'Its massive dome was a revolutionary architectural feat for its time.', 'It has served as an Eastern Orthodox cathedral, a Roman Catholic cathedral, a mosque, and a museum.'],
        ["The current building was originally constructed as a Christian cathedral between 532 and 537.", "The name Hagia Sophia means 'Holy Wisdom' in Greek.", "The building is renowned for its massive dome."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'hagia-sophia',
    variations: 4,
  },
  {
    id: 'lvl_022',
    place: 'Acropolis of Athens',
    country: 'Greece',
    facts: [
        ['The most famous building on the Acropolis is the Parthenon.', "The word Acropolis is from the Greek words 'akron' (highest point) and 'polis' (city).", 'Many of its original marble statues are now in the British Museum, a point of controversy.'],
        ["The Acropolis is an ancient citadel located on a rocky outcrop above the city of Athens.", "The site contains the remains of several ancient buildings of great architectural and historic significance.", "The Acropolis was formally proclaimed as the preeminent monument on the European Heritage list on 26 March 2007."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'acropolis',
    variations: 4,
  },
  {
    id: 'lvl_023',
    place: 'Golden Gate Bridge',
    country: 'USA',
    facts: [
        ["Its signature color is called 'International Orange'.", 'The bridge has been closed due to high winds only three times.', 'The main cables are made of 27,572 individual wires bundled together.'],
        ["The bridge was opened to the public on May 27, 1937.", "The bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean.", "The bridge is one of the most internationally recognized symbols of San Francisco and California."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'golden-gate-bridge',
    variations: 4,
  },
  {
    id: 'lvl_024',
    place: 'Sagrada Família',
    country: 'Spain',
    facts: [
        ['It has been under construction since 1882 and is still not finished.', 'The architect, Antoni Gaudí, is buried in the crypt.', 'When completed, it will have 18 spires, representing the Twelve Apostles, the Virgin Mary, the four Evangelists, and Jesus Christ.'],
        ["The basilica is a UNESCO World Heritage Site.", "Gaudí devoted his last years to the project, and at the time of his death at age 73 in 1926, less than a quarter of the project was complete.", "Construction passed the midpoint in 2010."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'sagrada-familia',
    variations: 4,
  },
  {
    id: 'lvl_025',
    place: 'Hallgrímskirkja',
    country: 'Iceland',
    facts: [
        ['At 74.5 meters high, it is the largest church in Iceland.', "Its design is inspired by the basalt lava flows found in Iceland's nature.", 'It took 41 years to build, from 1945 to 1986.'],
        ["The church is named after the Icelandic poet and clergyman Hallgrímur Pétursson.", "The church houses a large pipe organ by the German organ builder Johannes Klais of Bonn.", "The church is one of Reykjavík's best-known landmarks."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'hallgrimskirkja',
    variations: 4,
  },
  {
    id: 'lvl_026',
    place: 'Fushimi Inari Shrine',
    country: 'Japan',
    facts: [
        ['It is famous for its thousands of vermilion torii gates.', 'Each gate is donated by an individual or a company, with the name inscribed on the back.', 'The shrine is dedicated to Inari, the Shinto god of rice.'],
        ["The shrine is located at the base of a mountain also named Inari.", "The trails up the mountain are marked by a series of torii gates.", "The shrine is one of the most popular tourist destinations in Kyoto."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'fushimi-inari-shrine',
    variations: 4,
  },
  {
    id: 'lvl_027',
    place: 'Flatiron Building',
    country: 'USA',
    facts: [
        ["It was one of New York City's first skyscrapers.", 'Its triangular shape was a response to the shape of the plot of land it was built on.', "The term '23 skidoo', meaning to leave quickly, is said to have originated here due to the winds created by the building's shape."],
        ["The building was completed in 1902.", "The building is located at 175 Fifth Avenue in the borough of Manhattan.", "The building is a New York City designated landmark."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'flatiron-building',
    variations: 4,
  },
  {
    id: 'lvl_028',
    place: 'The Shard',
    country: 'UK',
    facts: [
        ['It is the tallest building in the United Kingdom.', 'The building is named for its resemblance to a shard of glass.', '95% of the construction materials are from recycled sources.'],
        ["The building was inaugurated on 5 July 2012.", "The building has 95 stories, with a viewing gallery and open-air observation deck on the 72nd floor.", "The building was designed by the Italian architect Renzo Piano."]
    ],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'the-shard',
    variations: 4,
  },
  {
    id: 'lvl_029',
    place: 'Guggenheim Museum Bilbao',
    country: 'Spain',
    facts: [
        ['It is one of the most admired works of contemporary architecture.', 'The building is covered in titanium panels, which change color depending on the light.', "The museum's design was created with the help of computer-aided design (CAD) technology."],
        ["The museum was inaugurated on 18 October 1997 by King Juan Carlos I of Spain.", "The museum was designed by Canadian-American architect Frank Gehry.", "The museum is one of several museums belonging to the Solomon R. Guggenheim Foundation."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'guggenheim-bilbao',
    variations: 4,
  },
  {
    id: 'lvl_030',
    place: 'Fallingwater',
    country: 'USA',
    facts: [
        ['It was designed by architect Frank Lloyd Wright in 1935.', 'The house is built partially over a waterfall on Bear Run.', 'It was a weekend home for the Kaufmann family, owners of a Pittsburgh department store.'],
        ["The house is a National Historic Landmark.", "The house was designated a World Heritage Site in 2019.", "The house is known for its connection to the site; it is built over a waterfall."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'fallingwater',
    variations: 4,
  },
  {
    id: 'lvl_031',
    place: 'Atomium',
    country: 'Belgium',
    facts: [
        ["It was constructed for the 1958 Brussels World's Fair (Expo 58).", 'It represents an iron crystal magnified 165 billion times.', 'The top sphere has a panoramic restaurant with views of Brussels.'],
        ["The Atomium was designed by the engineer André Waterkeyn and architects André and Jean Polak.", "The nine spheres are connected by tubes with escalators and a lift.", "The spheres have a diameter of 18 m (59 ft)."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'atomium',
    variations: 4,
  },
  {
    id: 'lvl_032',
    place: 'Notre-Dame Cathedral',
    country: 'France',
    facts: [
        ['Construction began in 1163 and was largely complete by 1260.', 'It is one of the finest examples of French Gothic architecture.', 'A major fire in 2019 destroyed the spire and roof but the main structure was saved.'],
        ["The cathedral is widely considered to be one of the finest examples of French Gothic architecture.", "The cathedral's treasury contains some of Catholicism's most important relics, including the purported Crown of Thorns, a fragment of the True Cross, and one of the Holy Nails.", "The cathedral is the seat of the Archbishop of Paris."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'notre-dame',
    variations: 4,
  },
  {
    id: 'lvl_033',
    place: 'Leaning Tower of Pisa',
    country: 'Italy',
    facts: [
        ["The tower's tilt began during construction due to an inadequate foundation.", 'The tilt was stabilized in the late 20th and early 21st centuries.', 'Galileo Galilei is said to have dropped two cannonballs of different masses from the tower to demonstrate that their speed of descent was independent of their mass.'],
        ["The tower is the campanile, or freestanding bell tower, of the cathedral of the Italian city of Pisa.", "The tower has eight stories, including the belfry.", "The tower's height is 55.86 metres (183.27 feet) from the ground on the low side and 56.67 metres (185.93 feet) on the high side."]
    ],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'leaning-tower-of-pisa',
    variations: 4,
  },
  {
    id: 'lvl_034',
    place: 'Marina Bay Sands',
    country: 'Singapore',
    facts: [
        ['The resort is topped by a 340-metre-long SkyPark with a capacity of 3,902 people.', "The infinity pool on the roof is the world's largest at that height.", 'It is one of the most expensive standalone casino properties in the world.'],
        ["The resort was designed by Moshe Safdie architects.", "The resort opened in 2010.", "The resort has a hotel, a casino, a mall, a convention center, a theatre, a museum, and two floating pavilions."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'marina-bay-sands',
    variations: 4,
  },
  {
    id: 'lvl_035',
    place: 'Petronas Towers',
    country: 'Malaysia',
    facts: [
        ['They were the tallest buildings in the world from 1998 to 2004.', 'The two towers are connected by a double-decker skybridge on the 41st and 42nd floors.', 'The design of the floor plates is based on an eight-pointed star, a symbol in Islamic culture.'],
        ["The towers were designed by Argentine architect César Pelli.", "The towers have 88 floors.", "The towers are a landmark of Kuala Lumpur."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'petronas-towers',
    variations: 4,
  },
  {
    id: 'lvl_036',
    place: 'Empire State Building',
    country: 'USA',
    facts: [
        ["It was the world's tallest building for nearly 40 years.", 'It has its own zip code: 10118.', 'The building has been featured in over 250 TV shows and movies.'],
        ["The building was designed by Shreve, Lamb & Harmon and completed in 1931.", "The building has 102 floors.", "The building is a National Historic Landmark."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'empire-state-building',
    variations: 4,
  },
  {
    id: 'lvl_037',
    place: 'CN Tower',
    country: 'Canada',
    facts: [
        ["It was the world's tallest free-standing structure for 32 years.", "The EdgeWalk is the world's highest full circle hands-free walk.", "The main pod's design was inspired by a sunflower seed."],
        ["The tower was completed in 1976.", "The tower is located in downtown Toronto.", "The tower is a signature icon of Toronto's skyline."]
    ],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'cn-tower',
    variations: 4,
  },
  {
    id: 'lvl_038',
    place: 'Mont Saint-Michel',
    country: 'France',
    facts: [
        ['It is a tidal island and mainland commune in Normandy, France.', 'The abbey was used as a prison during the French Revolution.', 'The tides in the area can vary by as much as 14 meters, creating a dramatic landscape.'],
        ["The island has held strategic fortifications since ancient times and since the 8th century AD has been the seat of the monastery from which it draws its name.", "The island is a UNESCO World Heritage Site.", "The island is one of France's most recognizable landmarks."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'mont-saint-michel',
    variations: 4,
  },
  {
    id: 'lvl_039',
    place: 'Space Needle',
    country: 'USA',
    facts: [
        ['It was built for the 1962 World\'s Fair.', 'The observation deck is 520 ft (160 m) high.', 'It is designed to withstand winds up to 200 mph (320 km/h) and earthquakes up to 9.1 magnitude.'],
        ["The Space Needle is an observation tower in Seattle, Washington.", "The tower is a landmark of the Pacific Northwest and a symbol of Seattle.", "The tower has a restaurant at the top that rotates 360 degrees in approximately 47 minutes."]
    ],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'space-needle',
    variations: 4,
  },
  {
    id: 'lvl_040',
    place: 'Taipei 101',
    country: 'Taiwan',
    facts: [
        ['It was the world\'s tallest building from 2004 until 2010.', "It has one of the world's fastest elevators.", 'A giant tuned mass damper is housed in the top of the tower to offset movements caused by strong winds.'],
        ["The building was designed by C.Y. Lee & partners and constructed primarily by KTRT Joint Venture.", "The building has 101 floors.", "The building is a landmark of Taipei."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'taipei-101',
    variations: 4,
  },
  {
    id: 'lvl_041',
    place: 'Bran Castle',
    country: 'Romania',
    facts: [
        ["It is commonly known as 'Dracula's Castle'.", 'It is now a museum dedicated to displaying art and furniture collected by Queen Marie of Romania.', 'The castle is situated on the border between Transylvania and Wallachia.'],
        ["The castle is a national monument and landmark in Romania.", "The castle is often referred to as the home of the title character in Bram Stoker's Dracula.", "There is, however, no evidence that Stoker knew anything about this castle."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'bran-castle',
    variations: 3,
  },
  {
    id: 'lvl_042',
    place: 'Chichen Itza',
    country: 'Mexico',
    facts: [
        ['It was one of the largest Maya cities.', 'The main pyramid, El Castillo, is a temple to the god Kukulkan.', 'Twice a year, on the spring and autumn equinoxes, a shadow falls on the pyramid in the shape of a serpent.'],
        ["The site is a UNESCO World Heritage Site.", "The site is one of the most visited archaeological sites in Mexico.", "The name Chichen Itza means 'At the mouth of the well of the Itza'."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'chichen-itza',
    variations: 4,
  },
  {
    id: 'lvl_043',
    place: 'Moai Statues',
    country: 'Chile',
    facts: [
        ['They were carved by the Rapa Nui people on Easter Island between 1250 and 1500.', 'Most moai were carved from the volcanic tuff at Rano Raraku quarry.', 'The statues are monolithic, meaning they were carved in one piece.'],
        ["The production and transportation of the more than 900 statues are considered remarkable creative and physical feats.", "The tallest moai erected, called Paro, was almost 10 metres (33 ft) high and weighed 82 tonnes (90.4 tons).", "The heaviest moai erected was a shorter but squatter moai at Ahu Tongariki, weighing 86 tonnes."]
    ],
    category: 'nature',
    visualComplexity: 'medium',
    imageId: 'moai-statues',
    variations: 4,
  },
  {
    id: 'lvl_044',
    place: 'The Alhambra',
    country: 'Spain',
    facts: [
        ['It is a palace and fortress complex of the Moorish rulers in Granada.', "The name Alhambra comes from an Arabic root which means 'red castle'.", 'It is famous for its intricate Islamic tilework and calligraphy.'],
        ["The Alhambra is a UNESCO World Heritage Site.", "It is one of Spain's most significant and well-known tourist attractions.", "The palace is known for its intricate stucco work, tile mosaics, and wood carvings."]
    ],
    category: 'interior',
    visualComplexity: 'high',
    imageId: 'alhambra',
    variations: 4,
  },
  {
    id: 'lvl_045',
    place: 'Buckingham Palace',
    country: 'UK',
    facts: [
        ['It is the London residence and administrative headquarters of the monarch of the United Kingdom.', 'The palace has 775 rooms.', 'The famous Changing of the Guard ceremony takes place outside the palace.'],
        ["The palace is a major tourist attraction and a symbol of the British monarchy.", "The palace has been the official London residence of the UK's sovereigns since 1837.", "The palace is used for state occasions and royal hospitality."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'buckingham-palace',
    variations: 4,
  },
  {
    id: 'lvl_046',
    place: 'Forbidden City',
    country: 'China',
    facts: [
        ['It was the former Chinese imperial palace from the Ming dynasty to the end of the Qing dynasty.', 'It consists of over 980 buildings.', 'The complex is surrounded by a 10-meter-high defensive wall and a 52-meter-wide moat.'],
        ["The Forbidden City is a UNESCO World Heritage Site.", "The complex is the largest collection of preserved ancient wooden structures in the world.", "The Forbidden City was the political and ritual center of China for over 500 years."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'forbidden-city',
    variations: 4,
  },
  {
    id: 'lvl_047',
    place: 'Brandenburg Gate',
    country: 'Germany',
    facts: [
        ['It is an 18th-century neoclassical monument in Berlin.', 'It has often been a site for major historical events and is today considered a symbol of European unity.', 'The Quadriga, a statue of a chariot drawn by four horses, sits atop the gate.'],
        ["The gate is located in the western part of the city centre of Berlin.", "The gate is one of the best-known landmarks of Germany.", "The gate was commissioned by King Frederick William II of Prussia as a sign of peace."]
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'brandenburg-gate',
    variations: 4,
  },
  {
    id: 'lvl_048',
    place: "St. Peter's Basilica",
    country: 'Vatican City',
    facts: [
        ['It is the largest church in the world.', 'Designed by architects including Michelangelo and Bernini.', "St. Peter's tomb is said to be directly below the high altar of the Basilica."],
        ["The basilica is a UNESCO World Heritage Site.", "The basilica is one of the most renowned works of Renaissance architecture.", "The basilica is a major pilgrimage site."]
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'st-peters-basilica',
    variations: 4,
  },
  {
    id: 'lvl_049',
    place: 'Hollywood Sign',
    country: 'USA',
    facts: [
        ["It originally read 'HOLLYWOODLAND' and was an advertisement for a local real estate development.", 'Each of the letters is 45 ft (13.7 m) tall.', 'The sign has been rebuilt and restored several times over the years.'],
        ["The sign is a landmark and American cultural icon overlooking Hollywood, Los Angeles, California.", "The sign is situated on Mount Lee, in the Hollywood Hills area of the Santa Monica Mountains.", "The sign is a popular tourist destination."]
    ],
    category: 'nature',
    visualComplexity: 'low',
    imageId: 'hollywood-sign',
    variations: 4,
  },
];


export const levels: Level[] = allLevels;

export function getImageUrl(
  imageId: string,
  availableVariations: number,
  round = 0
): { url: string; hint: string; facts: string[] } {
  const level = allLevels.find((l) => l.imageId === imageId);
  if (!level) {
    // Fallback to something that definitely exists
    return {
      url: `/images/eiffel-tower.jpg`,
      hint: "fallback",
      facts: [],
    };
  }

  const hint =
    PlaceHolderImages.find((p) => p.id === imageId)?.imageHint ?? "landmark";

  // Ensure we never have 0 variations
  const safeVariations = Math.max(1, availableVariations || 1);

  // Cycle through fact sets with round
  const factIndex = round % level.facts.length;
  const facts = level.facts[factIndex] ?? level.facts[0];

  // idx: 0..safeVariations-1
  const idx = round % safeVariations;

  let url: string;

  if (idx === 0) {
    // Base file: imageId.jpg (no suffix)
    url = `/images/${imageId}.jpg`;
  } else {
    // Variants: imageId-2.jpg, imageId-3.jpg, ...
    const fileVariantNumber = idx + 1; // 1 → 2, 2 → 3, ...
    url = `/images/${imageId}-${fileVariantNumber}.jpg`;
  }

  return { url, hint, facts };
}


export const generateRandomSwap = (gridSize: number): [number, number] => {
  const totalTiles = gridSize * gridSize;
  let index1 = Math.floor(Math.random() * totalTiles);
  let index2 = Math.floor(Math.random() * totalTiles);
  while (index1 === index2) {
    index2 = Math.floor(Math.random() * totalTiles);
  }
  return [index1, index2];
};

export const generatePuzzle = (imageId: string, grid: number) => {
  const level = allLevels.find(l => l.imageId === imageId);
  if (!level) {
    throw new Error(`Could not find level with imageId: ${imageId}`);
  }
  // Determine the variation based on the game round stored in localStorage.
  const round = typeof window !== 'undefined' ? parseInt(localStorage.getItem('gameRound') || '0', 10) : 0;
  
  const { url: imageUrl, hint: imageHint, facts } = getImageUrl(
    level.imageId,
    level.variations,
    round
  );
  
  const solvedBoard = Array.from({ length: grid * grid }, (_, i) => i);
  const scrambledBoard = [...solvedBoard];

  const swappedIndices = generateRandomSwap(grid);
  const [index1, index2] = swappedIndices;
  [scrambledBoard[index1], scrambledBoard[index2]] = [
    scrambledBoard[index2],
    scrambledBoard[index1],
  ];

  const proceduralHint = generateHint(grid, swappedIndices);

  return {
    solvedBoard,
    scrambledBoard,
    swapped: swappedIndices,
    imageUrl: imageUrl,
    imageHint: imageHint,
    hint: proceduralHint,
    facts: facts, // Pass the selected facts to the puzzle
  };
};
