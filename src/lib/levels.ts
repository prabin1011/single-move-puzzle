
export interface Level {
  id: string;
  place: string;
  country: string;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
  grid: number;
  facts: string[];
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
}

export const levels: Level[] = [
  {
    id: "lvl_001",
    place: "Eiffel Tower",
    country: "France",
    imageUrls: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "Was the world's tallest man-made structure for 41 years.",
        "Repainted every 7 years, requiring 60 tons of paint.",
        "Has over 1,665 steps to the top."
    ],
    hint: "Focus on the structure's base.",
    difficulty: "easy"
  },
  {
      id: "lvl_002",
      place: "Colosseum",
      country: "Italy",
      imageUrls: [
        "https://images.unsplash.com/photo-1552832230-c01979b880ca?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1628178129579-0556515438a0?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1569979344155-2603683e3b55?q=80&w=1200&h=1200&fit=crop"
      ],
      grid: 3,
      facts: [
          "Could hold an estimated 50,000 to 80,000 spectators.",
          "Used for gladiatorial contests and public spectacles.",
          "Much of it was damaged by earthquakes and stone-robbers."
      ],
      hint: "Look at the arches.",
      difficulty: "medium"
  },
  {
    id: "lvl_003",
    place: "Statue of Liberty",
    country: "USA",
    imageUrls: [
      "https://images.unsplash.com/photo-1503575689137-5dc338426774?q=80&w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1544458315-96b529b39ce5?q=80&w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1588602649165-d41334657c74?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
      "It was a gift to the United States from the people of France in 1886.",
      "The crown's seven rays represent the seven continents.",
      "The outer skin is made of copper and is only 3/32 of an inch thick."
    ],
    hint: "Focus on the tablet.",
    difficulty: "easy"
  },
  {
    id: "lvl_004",
    place: "Taj Mahal",
    country: "India",
    imageUrls: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1564514057492-44641b595213?q=80&w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1587135941948-46253261a893?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
      "It's a mausoleum built by emperor Shah Jahan for his wife Mumtaz Mahal.",
      "It took over 20,000 artisans 22 years to build.",
      "The building appears to change color depending on the time of day."
    ],
    hint: "Look at the central dome.",
    difficulty: "medium"
  },
  {
    id: "lvl_005",
    place: "Machu Picchu",
    country: "Peru",
    imageUrls: [
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1532981912820-72133a979654?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1617469165786-8007eda331b5?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "It was an Inca citadel built in the 15th century.",
        "It is often called the 'Lost City of the Incas'.",
        "The site is comprised of over 150 buildings."
    ],
    hint: "Focus on the main structures.",
    difficulty: "hard"
  },
  {
    id: "lvl_006",
    place: "Great Wall of China",
    country: "China",
    imageUrls: [
        "https://images.unsplash.com/photo-1509031583471-93c83494025d?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1529989637425-a5890c580?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1616095919013-fd1072979213?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "It is not a single continuous wall, but a system of fortifications.",
        "It is the longest man-made structure in the world.",
        "It is not visible from the moon with the naked eye."
    ],
    hint: "Look at the path of the wall.",
    difficulty: "medium"
  },
  {
    id: "lvl_007",
    place: "Petra",
    country: "Jordan",
    imageUrls: [
        "https://images.unsplash.com/photo-1568224599908-d21a3674e53c?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1558034842-a146b9a735c9?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1601121045244-a01f5a507886?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "It is famous for its rock-cut architecture.",
        "It is also known as the 'Rose City' due to the color of the stone.",
        "Featured in 'Indiana Jones and the Last Crusade'."
    ],
    hint: "Focus on the main Treasury building.",
    difficulty: "hard"
  },
  {
    id: "lvl_008",
    place: "Christ the Redeemer",
    country: "Brazil",
    imageUrls: [
        "https://images.unsplash.com/photo-1593457316828-77d0c3741b1d?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1587282290693-76204b6c9343?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1548232971-c5243d9152b9?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "It is an Art Deco statue of Jesus Christ in Rio de Janeiro.",
        "It is 30 meters tall, not including its 8-meter pedestal.",
        "It is made of reinforced concrete and soapstone."
    ],
    hint: "Look at the statue's arms.",
    difficulty: "easy"
  },
  {
    id: "lvl_009",
    place: "Pyramids of Giza",
    country: "Egypt",
    imageUrls: [
        "https://images.unsplash.com/photo-1572094389608-5173cb4321ac?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1623916993888-05d53951590c?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1559899539-65318a615a6b?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "The Great Pyramid was the tallest man-made structure for over 3,800 years.",
        "They were built as tombs for the pharaohs.",
        "They are the oldest of the Seven Wonders of the Ancient World."
    ],
    hint: "Focus on the alignment of the pyramids.",
    difficulty: "medium"
  },
  {
    id: "lvl_010",
    place: "Sydney Opera House",
    country: "Australia",
    imageUrls: [
        "https://images.unsplash.com/photo-1624322479549-0624a73c1664?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1549180030-487aba943493?q=80&w=1200&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1523059623051-4734315254?q=80&w=1200&h=1200&fit=crop"
    ],
    grid: 3,
    facts: [
        "Its roof is made of more than 1 million tiles.",
        "It hosts over 1,500 performances each year.",
        "It was designed by Danish architect Jørn Utzon."
    ],
    hint: "Look at the 'sails' of the roof.",
    difficulty: "easy"
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
export const generatePuzzle = (level: Level, imageUrl: string) => {
  const solvedBoard = Array.from({ length: level.grid * level.grid }, (_, i) => i);
  const scrambledBoard = [...solvedBoard];
  
  const swappedIndices = generateRandomSwap(level.grid);
  const [index1, index2] = swappedIndices;
  [scrambledBoard[index1], scrambledBoard[index2]] = [scrambledBoard[index2], scrambledBoard[index1]];

  return {
    solvedBoard,
    scrambledBoard,
    swapped: swappedIndices,
    imageUrl: imageUrl,
  };
};

