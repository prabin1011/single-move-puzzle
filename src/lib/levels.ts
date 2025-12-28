
export interface Level {
  id: string;
  place: string;
  country: string;
  imageUrl: string;
  grid: number;
  swapped: [number, number];
  facts: string[];
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
}

export const levels: Level[] = [
  {
    id: "lvl_001",
    place: "Eiffel Tower",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1200&h=1200&fit=crop",
    grid: 3,
    swapped: [0, 5],
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
      imageUrl: "https://images.unsplash.com/photo-1552832230-c01979b880ca?q=80&w=1200&h=1200&fit=crop",
      grid: 3,
      swapped: [3, 8],
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
    imageUrl: "https://images.unsplash.com/photo-1503575689137-5dc338426774?q=80&w=1200&h=1200&fit=crop",
    grid: 3,
    swapped: [2, 6],
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
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&h=1200&fit=crop",
    grid: 3,
    swapped: [4, 7],
    facts: [
      "It's a mausoleum built by emperor Shah Jahan for his wife Mumtaz Mahal.",
      "It took over 20,000 artisans 22 years to build.",
      "The building appears to change color depending on the time of day."
    ],
    hint: "Look at the central dome.",
    difficulty: "medium"
  }
];

// Helper function to generate the initial board state for a level
export const generatePuzzle = (level: Level) => {
  const solvedBoard = Array.from({ length: level.grid * level.grid }, (_, i) => i);
  const scrambledBoard = [...solvedBoard];
  
  // Perform the specified swap
  const [index1, index2] = level.swapped;
  [scrambledBoard[index1], scrambledBoard[index2]] = [scrambledBoard[index2], scrambledBoard[index1]];

  return {
    solvedBoard,
    scrambledBoard
  };
};
