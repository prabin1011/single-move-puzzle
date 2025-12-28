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
    imageUrl: swayambhunathImage?.imageUrl || "https://picsum.photos/seed/lvl_001/1200/1200",
    grid: 3,
    swapped: [1, 7],
    facts: [
      "Also known as the Monkey Temple",
      "Over 1,500 years old",
      "One of the holiest Buddhist sites in Nepal"
    ],
    hint: "Look at the stupa alignment",
    difficulty: "easy"
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
