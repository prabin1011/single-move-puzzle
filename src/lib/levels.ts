
export interface Level {
  id: string;
  place: string;
  country: string;
  // grid is now a suggestion, the game container will override it
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
      grid: 3,
      facts: [
          "Could hold an estimated 50,000 to 80,000 spectators.",
          "Used for gladiatorial contests and public spectacles.",
          "Much of it was damaged by earthquakes and stone-robbers."
      ],
      hint: "Look at the arches.",
      difficulty: "easy"
  },
  {
    id: "lvl_003",
    place: "Statue of Liberty",
    country: "USA",
    grid: 3,
    facts: [
      "It was a gift to the United States from the people of France in 1886.",
      "The crown's seven rays represent the seven continents.",
      "The outer skin is made of copper and is only 3/32 of an inch thick."
    ],
    hint: "Focus on the tablet.",
    difficulty: "medium"
  },
  {
    id: "lvl_004",
    place: "Taj Mahal",
    country: "India",
    grid: 4,
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
    grid: 4,
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
    grid: 4,
    facts: [
        "It is not a single continuous wall, but a system of fortifications.",
        "It is the longest man-made structure in the world.",
        "It is not visible from the moon with the naked eye."
    ],
    hint: "Look at the path of the wall.",
    difficulty: "hard"
  },
  {
    id: "lvl_007",
    place: "Petra",
    country: "Jordan",
    grid: 5,
    facts: [
        "It is famous for its rock-cut architecture.",
        "It is also known as the 'Rose City' due to the color of the stone.",
        "Featured in 'Indiana Jones and the Last Crusade'."
    ],
    hint: "Focus on the main Treasury building.",
    difficulty: "expert"
  },
  {
    id: "lvl_008",
    place: "Christ the Redeemer",
    country: "Brazil",
    grid: 5,
    facts: [
        "It is an Art Deco statue of Jesus Christ in Rio de Janeiro.",
        "It is 30 meters tall, not including its 8-meter pedestal.",
        "It is made of reinforced concrete and soapstone."
    ],
    hint: "Look at the statue's arms.",
    difficulty: "expert"
  },
  {
    id: "lvl_009",
    place: "Pyramids of Giza",
    country: "Egypt",
    grid: 5,
    facts: [
        "The Great Pyramid was the tallest man-made structure for over 3,800 years.",
        "They were built as tombs for the pharaohs.",
        "They are the oldest of the Seven Wonders of the Ancient World."
    ],
    hint: "Focus on the alignment of the pyramids.",
    difficulty: "master"
  },
  {
    id: "lvl_010",
    place: "Sydney Opera House",
    country: "Australia",
    grid: 5,
    facts: [
        "Its roof is made of more than 1 million tiles.",
        "It hosts over 1,500 performances each year.",
        "It was designed by Danish architect Jørn Utzon."
    ],
    hint: "Look at the 'sails' of the roof.",
    difficulty: "master"
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
export const generatePuzzle = (level: Level, imageUrl: string, grid: number) => {
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
