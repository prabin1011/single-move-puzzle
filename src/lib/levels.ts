
export interface Level {
  id: string;
  place: string;
  country: string;
  facts: string[];
  hint: string;
  category: 'architecture' | 'nature' | 'sky' | 'city' | 'interior' | 'abstract';
  visualComplexity: 'low' | 'medium' | 'high';
  image: {
    url: string;
    hint: string;
  };
}

// The 'grid' property is removed from here. It will now be determined by the game-config.
export const levels: Level[] = [
  // 5 Easy Levels (3x3)
  {
    id: "lvl_001",
    place: "Eiffel Tower",
    country: "France",
    facts: [ "It was the main exhibit of the 1889 Exposition Universelle (World's Fair).", "The tower's iron structure weighs 7,300 tons.", "It is the most-visited paid monument in the world." ],
    hint: "Focus on the structure's base.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=600&h=600&fit=crop", hint: "paris france" }
  },
  {
    id: "lvl_002",
    place: "Colosseum",
    country: "Italy",
    facts: [ "It's the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today.", "The hypogeum, an underground network of tunnels, was added later to house gladiators and animals.", "It's estimated that over 400,000 people and 1 million animals died within its walls." ],
    hint: "Look at the arches.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1552832230-c01979b880ca?q=80&w=600&h=600&fit=crop", hint: "rome italy" }
  },
  {
    id: "lvl_003",
    place: "Mount Fuji",
    country: "Japan",
    facts: ["It is an active volcano that last erupted in 1707.", "It is one of Japan's 'Three Holy Mountains' along with Mount Tate and Mount Haku.", "On clear days, it can be seen from Tokyo, about 100 kilometers away."],
    hint: "Focus on the snow-capped peak.",
    category: "nature",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1578637387935-4504c5ea99b6?q=80&w=600&h=600&fit=crop", hint: "japan fuji" }
  },
  {
    id: "lvl_004",
    place: "Santorini",
    country: "Greece",
    facts: ["The island is the site of one of the largest volcanic eruptions in recorded history.", "The iconic white and blue buildings are built on the edge of a caldera.", "Many of the houses are carved into the cliffs."],
    hint: "Look for the blue domes.",
    category: "city",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1559239115-ce39e767f444?q=80&w=600&h=600&fit=crop", hint: "greece santorini" }
  },
  {
    id: "lvl_005",
    place: "Northern Lights",
    country: "Various",
    facts: ["Also known as Aurora Borealis, they are caused by collisions between electrically charged particles from the sun that enter the Earth's atmosphere.", "The colors can vary, with green being the most common, followed by pink.", "The best places to see them are in the 'auroral zone', which includes parts of Iceland, Norway, and Canada."],
    hint: "The sky is the main feature.",
    category: "sky",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=600&h=600&fit=crop", hint: "aurora sky" }
  },

  // 10 Easy-Medium Levels (4x4)
  {
    id: "lvl_006",
    place: "Statue of Liberty",
    country: "USA",
    facts: [ "The statue's copper skin turned its characteristic green color due to oxidation over about 30 years.", "It functioned as a lighthouse from 1886 to 1901.", "The seven spikes on the crown represent the seven oceans and continents." ],
    hint: "Focus on the tablet.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1503575689137-5dc338426774?q=80&w=600&h=600&fit=crop", hint: "new-york usa" }
  },
  {
    id: "lvl_007",
    place: "Taj Mahal",
    country: "India",
    facts: [ "It is a perfectly symmetrical building.", "The four minarets are slightly tilted outwards to protect the main tomb from collapse.", "Over 1,000 elephants were used to transport building materials." ],
    hint: "Look at the central dome.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&h=600&fit=crop", hint: "agra india" }
  },
  {
    id: "lvl_008",
    place: "Machu Picchu",
    country: "Peru",
    facts: [ "It was built around 1450, at the height of the Inca Empire.", "The site was abandoned just over 100 years later.", "It's constructed of dry-stone walls, where stones fit so tightly no mortar was needed." ],
    hint: "Focus on the main structures.",
    category: "nature",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&h=600&fit=crop", hint: "peru inca" }
  },
  {
    id: "lvl_009",
    place: "Great Wall of China",
    country: "China",
    facts: [ "It is not a single continuous wall but a system of defenses.", "Sticky rice flour was used in the binding material for the bricks.", "It is not, as is commonly believed, visible from the moon with the naked eye." ],
    hint: "Look at the path of the wall.",
    category: "nature",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1508804185872-d7bad5d59b35?q=80&w=600&h=600&fit=crop", hint: "china wall" }
  },
  {
    id: "lvl_010",
    place: "Pyramids of Giza",
    country: "Egypt",
    facts: [ "The Great Pyramid was the tallest man-made structure for over 3,800 years.", "The three pyramids are precisely aligned with the stars of Orion's Belt.", "Its construction is estimated to have involved 100,000 workers." ],
    hint: "Focus on the alignment of the pyramids.",
    category: "nature",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1572094389608-5173cb4321ac?q=80&w=600&h=600&fit=crop", hint: "egypt pyramids" }
  },
   {
    id: "lvl_011",
    place: "Christ the Redeemer",
    country: "Brazil",
    facts: [ "The statue is the largest Art Deco-style sculpture in the world.", "It has been struck by lightning multiple times.", "The outer layers are composed of 6 million soapstone tiles." ],
    hint: "Look at the statue's arms.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1593457316828-77d0c3741b1d?q=80&w=600&h=600&fit=crop", hint: "brazil rio" }
  },
  {
    id: "lvl_012",
    place: "Petra",
    country: "Jordan",
    facts: [ "It's known as the 'Rose City' due to the color of the stone.", "At its peak, it was a bustling trade hub.", "Only about 15% of the city has been uncovered by archaeologists." ],
    hint: "Focus on the main Treasury building.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1559928230-b7de0badc5b2?q=80&w=600&h=600&fit=crop", hint: "jordan petra" }
  },
  {
    id: "lvl_013",
    place: "Grand Canyon",
    country: "USA",
    facts: ["The canyon is about 277 miles long, up to 18 miles wide and attains a depth of over a mile.", "It is one of the Seven Natural Wonders of the World.", "It was carved by the Colorado River over a period of 6 million years."],
    hint: "Look for the river at the bottom.",
    category: "nature",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1474044159625-1eb729aabc34?q=80&w=600&h=600&fit=crop", hint: "arizona usa" }
  },
  {
    id: "lvl_014",
    place: "Venice Canals",
    country: "Italy",
    facts: ["The city is built on more than 100 small islands in a lagoon in the Adriatic Sea.", "It has no roads, just canals, including the Grand Canal thoroughfare.", "There are over 400 bridges connecting the islands."],
    hint: "Focus on the gondolas.",
    category: "city",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=600&h=600&fit=crop", hint: "venice italy" }
  },
  {
    id: "lvl_015",
    place: "Sydney Opera House",
    country: "Australia",
    facts: [ "The design was chosen from an international competition with 233 entries.", "The roof is covered with over 1 million tiles.", "It has its own seawater cooling system, using water from the harbor." ],
    hint: "Look at the 'sails' of the roof.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&h=600&fit=crop", hint: "sydney australia" }
  },

  // 15 Medium Levels (5x5)
  {
    id: "lvl_016",
    place: "Burj Khalifa",
    country: "UAE",
    facts: ["It is the tallest building in the world.", "The tip of the spire can be seen from up to 95 kilometers away.", "It holds records for the highest observation deck and elevator with the longest travel distance."],
    hint: "The building's pointed spire is key.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1523963833-216205753443?q=80&w=600&h=600&fit=crop", hint: "dubai uae" }
  },
  {
    id: "lvl_017",
    place: "The Louvre",
    country: "France",
    facts: ["It is the world's largest art museum.", "The glass pyramid entrance was a controversial addition in 1989.", "It is home to the Mona Lisa, which has its own mailbox for fan letters."],
    hint: "Focus on the glass pyramid.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=600&h=600&fit=crop", hint: "paris france museum" }
  },
  {
    id: "lvl_018",
    place: "St. Basil's Cathedral",
    country: "Russia",
    facts: ["It was built on the orders of Ivan the Terrible.", "The building's design is shaped as the flame of a bonfire rising into the sky.", "No other building in Russia is like it; it's a unique piece of Russian architecture."],
    hint: "The colorful onion domes are iconic.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1588439369085-813a3623350a?q=80&w=600&h=600&fit=crop", hint: "moscow russia" }
  },
  {
    id: "lvl_019",
    place: "Neuschwanstein Castle",
    country: "Germany",
    facts: ["The castle was intended as a home for King Ludwig II of Bavaria.", "It was the inspiration for Disneyland's Sleeping Beauty Castle.", "Despite its medieval look, it was built in the 19th century and had modern technology for its time."],
    hint: "The castle is perched on a rugged hill.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1597142755331-7d81e1440713?q=80&w=600&h=600&fit=crop", hint: "germany castle" }
  },
    {
    id: "lvl_020",
    place: "Angkor Wat",
    country: "Cambodia",
    facts: ["It is the largest religious monument in the world by land area.", "It was originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire.", "It appears on Cambodia's national flag."],
    hint: "Focus on the five main towers.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1569429454486-805d23e73bae?q=80&w=600&h=600&fit=crop", hint: "cambodia temple" }
  },
  {
    id: "lvl_021",
    place: "London Eye",
    country: "UK",
    facts: ["It is the most popular paid tourist attraction in the United Kingdom.", "The 32 capsules are numbered 1 to 33, skipping number 13 for good luck.", "It was the world's tallest Ferris wheel when it opened in 2000."],
    hint: "The capsules are on the outside of the wheel.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1533929736458-ca5889121889?q=80&w=600&h=600&fit=crop", hint: "london uk" }
  },
  {
    id: "lvl_022",
    place: "Hagia Sophia",
    country: "Turkey",
    facts: ["It was the world's largest cathedral for nearly a thousand years.", "Its massive dome was a revolutionary architectural feat for its time.", "It has served as an Eastern Orthodox cathedral, a Roman Catholic cathedral, a mosque, and a museum."],
    hint: "Look for the large central dome and minarets.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1568219652679-b1c1cf9c9a59?q=80&w=600&h=600&fit=crop", hint: "istanbul turkey" }
  },
  {
    id: "lvl_023",
    place: "Acropolis of Athens",
    country: "Greece",
    facts: ["The most famous building on the Acropolis is the Parthenon.", "The word Acropolis is from the Greek words 'akron' (highest point) and 'polis' (city).", "Many of its original marble statues are now in the British Museum, a point of controversy."],
    hint: "The Parthenon temple is the most prominent feature.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1582266255765-fa5bee118f43?q=80&w=600&h=600&fit=crop", hint: "athens greece" }
  },
  {
    id: "lvl_024",
    place: "Golden Gate Bridge",
    country: "USA",
    facts: ["Its signature color is called 'International Orange'.", "The bridge has been closed due to high winds only three times.", "The main cables are made of 27,572 individual wires bundled together."],
    hint: "The two large towers are key.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1545224337-f03129767a14?q=80&w=600&h=600&fit=crop", hint: "san-francisco usa" }
  },
  {
    id: "lvl_025",
    place: "Sagrada Família",
    country: "Spain",
    facts: ["It has been under construction since 1882 and is still not finished.", "The architect, Antoni Gaudí, is buried in the crypt.", "When completed, it will have 18 spires, representing the Twelve Apostles, the Virgin Mary, the four Evangelists, and Jesus Christ."],
    hint: "The cranes and unique spires are a giveaway.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1582542496352-b883079cba34?q=80&w=600&h=600&fit=crop", hint: "barcelona spain" }
  },
  {
    id: "lvl_026",
    place: "Hallgrímskirkja",
    country: "Iceland",
    facts: ["At 74.5 meters high, it is the largest church in Iceland.", "Its design is inspired by the basalt lava flows found in Iceland's nature.", "It took 41 years to build, from 1945 to 1986."],
    hint: "The building's shape resembles organ pipes.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1584310129761-b5c5a278e34a?q=80&w=600&h=600&fit=crop", hint: "reykjavik iceland" }
  },
  {
    id: "lvl_027",
    place: "Fushimi Inari Shrine",
    country: "Japan",
    facts: ["It is famous for its thousands of vermilion torii gates.", "Each gate is donated by an individual or a company, with the name inscribed on the back.", "The shrine is dedicated to Inari, the Shinto god of rice."],
    hint: "Look for the endless path of red gates.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=600&h=600&fit=crop", hint: "kyoto japan" }
  },
  {
    id: "lvl_028",
    place: "Flatiron Building",
    country: "USA",
    facts: ["It was one of New York City's first skyscrapers.", "Its triangular shape was a response to the shape of the plot of land it was built on.", "The term '23 skidoo', meaning to leave quickly, is said to have originated here due to the winds created by the building's shape."],
    hint: "The building has a distinctive triangular shape.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1569427976426-19f3f9e9f64f?q=80&w=600&h=600&fit=crop", hint: "new-york city" }
  },
  {
    id: "lvl_029",
    place: "The Shard",
    country: "UK",
    facts: ["It is the tallest building in the United Kingdom.", "The building is named for its resemblance to a shard of glass.", "95% of the construction materials are from recycled sources."],
    hint: "A tall, pointed glass skyscraper.",
    category: "architecture",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1592080327791-356114a123a8?q=80&w=600&h=600&fit=crop", hint: "london uk" }
  },
  {
    id: "lvl_030",
    place: "Guggenheim Museum Bilbao",
    country: "Spain",
    facts: ["It is one of the most admired works of contemporary architecture.", "The building is covered in titanium panels, which change color depending on the light.", "The museum's design was created with the help of computer-aided design (CAD) technology."],
    hint: "The building has a unique, curvy, metallic structure.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1563167192-3e234a919318?q=80&w=600&h=600&fit=crop", hint: "bilbao spain" }
  },
  
  // 20 Hard Levels (6x6)
  {
    id: "lvl_031",
    place: "Fallingwater",
    country: "USA",
    facts: ["It was designed by architect Frank Lloyd Wright in 1935.", "The house is built partially over a waterfall on Bear Run.", "It was a weekend home for the Kaufmann family, owners of a Pittsburgh department store."],
    hint: "The house is integrated with a waterfall.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1566016185834-315f340026e6?q=80&w=600&h=600&fit=crop", hint: "pennsylvania usa" }
  },
  {
    id: "lvl_032",
    place: "Atomium",
    country: "Belgium",
    facts: ["It was constructed for the 1958 Brussels World's Fair (Expo 58).", "It represents an iron crystal magnified 165 billion times.", "The top sphere has a panoramic restaurant with views of Brussels."],
    hint: "Look for the structure of connected spheres.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1574900822167-979983942927?q=80&w=600&h=600&fit=crop", hint: "brussels belgium" }
  },
  {
    id: "lvl_033",
    place: "Notre-Dame Cathedral",
    country: "France",
    facts: ["Construction began in 1163 and was largely complete by 1260.", "It is one of the finest examples of French Gothic architecture.", "A major fire in 2019 destroyed the spire and roof but the main structure was saved."],
    hint: "The two bell towers and rose window are famous.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1556909211-136592289437?q=80&w=600&h=600&fit=crop", hint: "paris france" }
  },
  {
    id: "lvl_034",
    place: "Leaning Tower of Pisa",
    country: "Italy",
    facts: ["The tower's tilt began during construction due to an inadequate foundation.", "The tilt was stabilized in the late 20th and early 21st centuries.", "Galileo Galilei is said to have dropped two cannonballs of different masses from the tower to demonstrate that their speed of descent was independent of their mass."],
    hint: "The tower is famously tilted.",
    category: "architecture",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1599834562134-4a87263a7852?q=80&w=600&h=600&fit=crop", hint: "pisa italy" }
  },
  {
    id: "lvl_035",
    place: "Marina Bay Sands",
    country: "Singapore",
    facts: ["The resort is topped by a 340-metre-long SkyPark with a capacity of 3,902 people.", "The infinity pool on the roof is the world's largest at that height.", "It is one of the most expensive standalone casino properties in the world."],
    hint: "Look for the three towers with a ship-like structure on top.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1506824564827-5134c4c449f8?q=80&w=600&h=600&fit=crop", hint: "singapore city" }
  },
  {
    id: "lvl_036",
    place: "Petronas Towers",
    country: "Malaysia",
    facts: ["They were the tallest buildings in the world from 1998 to 2004.", "The two towers are connected by a double-decker skybridge on the 41st and 42nd floors.", "The design of the floor plates is based on an eight-pointed star, a symbol in Islamic culture."],
    hint: "Look for the twin towers connected by a bridge.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1582523219-425a81832360?q=80&w=600&h=600&fit=crop", hint: "kuala-lumpur malaysia" }
  },
  {
    id: "lvl_037",
    place: "Empire State Building",
    country: "USA",
    facts: ["It was the world's tallest building for nearly 40 years.", "It has its own zip code: 10118.", "The building has been featured in over 250 TV shows and movies."],
    hint: "A classic art deco skyscraper with a tall antenna.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1555690222-ea121ab58f89?q=80&w=600&h=600&fit=crop", hint: "new-york city" }
  },
  {
    id: "lvl_038",
    place: "CN Tower",
    country: "Canada",
    facts: ["It was the world's tallest free-standing structure for 32 years.", "The EdgeWalk is the world's highest full circle hands-free walk.", "The main pod's design was inspired by a sunflower seed."],
    hint: "A very tall, thin tower with a large observation pod.",
    category: "architecture",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1533993198888-9f1d4f24d156?q=80&w=600&h=600&fit=crop", hint: "toronto canada" }
  },
  {
    id: "lvl_039",
    place: "Mont Saint-Michel",
    country: "France",
    facts: ["It is a tidal island and mainland commune in Normandy, France.", "The abbey was used as a prison during the French Revolution.", "The tides in the area can vary by as much as 14 meters, creating a dramatic landscape."],
    hint: "A castle-like abbey on a small island.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1560930954-5735622a4049?q=80&w=600&h=600&fit=crop", hint: "normandy france" }
  },
  {
    id: "lvl_040",
    place: "Space Needle",
    country: "USA",
    facts: ["It was built for the 1962 World's Fair.", "The observation deck is 520 ft (160 m) high.", "It is designed to withstand winds up to 200 mph (320 km/h) and earthquakes up to 9.1 magnitude."],
    hint: "A futuristic tower with a saucer-shaped top.",
    category: "architecture",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1542223616-942643239335?q=80&w=600&h=600&fit=crop", hint: "seattle usa" }
  },
  {
    id: "lvl_041",
    place: "Taipei 101",
    country: "Taiwan",
    facts: ["It was the world's tallest building from 2004 until 2010.", "It has one of the world's fastest elevators.", "A giant tuned mass damper is housed in the top of the tower to offset movements caused by strong winds."],
    hint: "A skyscraper that looks like a stack of pagodas.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1533130097331-5a10520286e5?q=80&w=600&h=600&fit=crop", hint: "taipei taiwan" }
  },
  {
    id: "lvl_042",
    place: "Bran Castle",
    country: "Romania",
    facts: ["It is commonly known as 'Dracula's Castle'.", "It is now a museum dedicated to displaying art and furniture collected by Queen Marie of Romania.", "The castle is situated on the border between Transylvania and Wallachia."],
    hint: "A spooky-looking castle on a hill.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1597148545688-98a58a69882a?q=80&w=600&h=600&fit=crop", hint: "romania castle" }
  },
  {
    id: "lvl_043",
    place: "Chichen Itza",
    country: "Mexico",
    facts: ["It was one of the largest Maya cities.", "The main pyramid, El Castillo, is a temple to the god Kukulkan.", "Twice a year, on the spring and autumn equinoxes, a shadow falls on the pyramid in the shape of a serpent."],
    hint: "The large step-pyramid is the central feature.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1517402690963-ff072a3042e2?q=80&w=600&h=600&fit=crop", hint: "mexico maya" }
  },
  {
    id: "lvl_044",
    place: "Moai Statues",
    country: "Chile",
    facts: ["They were carved by the Rapa Nui people on Easter Island between 1250 and 1500.", "Most moai were carved from the volcanic tuff at Rano Raraku quarry.", "The statues are monolithic, meaning they were carved in one piece."],
    hint: "Large stone heads on a grassy hill.",
    category: "nature",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1568894176198-cf433a7f135b?q=80&w=600&h=600&fit=crop", hint: "easter-island chile" }
  },
  {
    id: "lvl_045",
    place: "The Alhambra",
    country: "Spain",
    facts: ["It is a palace and fortress complex of the Moorish rulers in Granada.", "The name Alhambra comes from an Arabic root which means 'red castle'.", "It is famous for its intricate Islamic tilework and calligraphy."],
    hint: "Look for ornate archways and detailed tile patterns.",
    category: "interior",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1581452900925-a1157c1e5052?q=80&w=600&h=600&fit=crop", hint: "granada spain" }
  },
  {
    id: "lvl_046",
    place: "Buckingham Palace",
    country: "UK",
    facts: ["It is the London residence and administrative headquarters of the monarch of the United Kingdom.", "The palace has 775 rooms.", "The famous Changing of the Guard ceremony takes place outside the palace."],
    hint: "A large, grand palace with a famous balcony.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&h=600&fit=crop", hint: "london uk" }
  },
  {
    id: "lvl_047",
    place: "Forbidden City",
    country: "China",
    facts: ["It was the former Chinese imperial palace from the Ming dynasty to the end of the Qing dynasty.", "It consists of over 980 buildings.", "The complex is surrounded by a 10-meter-high defensive wall and a 52-meter-wide moat."],
    hint: "Look for traditional Chinese palace architecture and red walls.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1618841599121-f3a74a148a43?q=80&w=600&h=600&fit=crop", hint: "beijing china" }
  },
  {
    id: "lvl_048",
    place: "Brandenburg Gate",
    country: "Germany",
    facts: ["It is an 18th-century neoclassical monument in Berlin.", "It has often been a site for major historical events and is today considered a symbol of European unity.", "The Quadriga, a statue of a chariot drawn by four horses, sits atop the gate."],
    hint: "A large classical gate topped with a horse chariot statue.",
    category: "architecture",
    visualComplexity: "medium",
    image: { url: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=600&h=600&fit=crop", hint: "berlin germany" }
  },
  {
    id: "lvl_049",
    place: "St. Peter's Basilica",
    country: "Vatican City",
    facts: ["It is the largest church in the world.", "Designed by architects including Michelangelo and Bernini.", "St. Peter's tomb is said to be directly below the high altar of the Basilica."],
    hint: "A massive dome and a large, colonnaded square.",
    category: "architecture",
    visualComplexity: "high",
    image: { url: "https://images.unsplash.com/photo-1552098482-43e5a7514d35?q=80&w=600&h=600&fit=crop", hint: "vatican city" }
  },
  {
    id: "lvl_050",
    place: "Hollywood Sign",
    country: "USA",
    facts: ["It originally read 'HOLLYWOODLAND' and was an advertisement for a local real estate development.", "Each of the letters is 45 ft (13.7 m) tall.", "The sign has been rebuilt and restored several times over the years."],
    hint: "Large white letters on a hillside.",
    category: "nature",
    visualComplexity: "low",
    image: { url: "https://images.unsplash.com/photo-1548236132-7576f3394b29?q=80&w=600&h=600&fit=crop", hint: "los-angeles usa" }
  }
];

export const generateRandomSwap = (gridSize: number): [number, number] => {
    const totalTiles = gridSize * gridSize;
    let index1 = Math.floor(Math.random() * totalTiles);
    let index2 = Math.floor(Math.random() * totalTiles);
    while (index1 === index2) {
        index2 = Math.floor(Math.random() * totalTiles);
    }
    return [index1, index2];
}

// Helper function to generate the initial board state for a level
export const generatePuzzle = (imageUrl: string, grid: number) => {
  const solvedBoard = Array.from({ length: grid * grid }, (_, i) => i);
  const scrambledBoard = [...solvedBoard];
  
  const swappedIndices = generateRandomSwap(grid);
  const [index1, index2] = swappedIndices;
  [scrambledBoard[index1], scrambledBoard[index2]] = [scrambledBoard[index2], scrambledBoard[index1]];

  return {
    solvedBoard,
    scrambledBoard,
    swapped: swappedIndices,
    imageUrl: imageUrl,
  };
};
