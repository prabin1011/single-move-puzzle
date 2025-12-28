import { PlaceHolderImages } from './placeholder-images';

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

const swayambhunathImage = PlaceHolderImages.find(img => img.id === 'swayambhunath');

export const levels: Level[] = [
  {
    id: "lvl_001",
    place: "Swayambhunath",
    country: "Nepal",
    imageUrl: swayambhunathImage?.imageUrl || "https://images.unsplash.com/photo-1544439585-649f8a842602?q=80&w=1200&h=1200&fit=crop",
    grid: 3,
    swapped: [1, 7],
    facts: [
      "Also known as the Monkey Temple",
      "Over 1,500 years old",
      "One of the holiest Buddhist sites in Nepal"
    ],
    hint: "Look at the stupa alignment",
    difficulty: "easy"
  },
  {
    id: "lvl_002",
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
      id: "lvl_003",
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
