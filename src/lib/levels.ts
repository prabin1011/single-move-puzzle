
export interface Level {
  id: string;
  place: string;
  country: string;
  facts: string[];
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'insane';
  category: 'architecture' | 'nature' | 'sky' | 'city' | 'interior' | 'abstract';
  image: {
    url: string;
    hint: string;
  };
}

// The 'grid' property is removed from here. It will now be determined by the game-config.
export const levels: Level[] = [
  {
    id: "lvl_001",
    place: "Eiffel Tower",
    country: "France",
    facts: [
        "It was the main exhibit of the 1889 Exposition Universelle (World's Fair).",
        "The tower's iron structure weighs 7,300 tons.",
        "It is the most-visited paid monument in the world."
    ],
    hint: "Focus on the structure's base.",
    difficulty: "easy",
    category: "architecture",
    image: {
        url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=600&h=600&fit=crop",
        hint: "paris france"
    }
  },
  {
      id: "lvl_002",
      place: "Colosseum",
      country: "Italy",
      facts: [
          "It's the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today.",
          "The hypogeum, an underground network of tunnels, was added later to house gladiators and animals.",
          "It's estimated that over 400,000 people and 1 million animals died within its walls."
      ],
      hint: "Look at the arches.",
      difficulty: "easy",
      category: "architecture",
      image: {
        url: "https://images.unsplash.com/photo-1552832230-c01979b880ca?q=80&w=600&h=600&fit=crop",
        hint: "rome italy"
      }
  },
  {
    id: "lvl_003",
    place: "Statue of Liberty",
    country: "USA",
    facts: [
      "The statue's copper skin turned its characteristic green color due to oxidation over about 30 years.",
      "It functioned as a lighthouse from 1886 to 1901, visible from up to 24 miles away.",
      "The seven spikes on the crown represent the seven oceans and seven continents of the world."
    ],
    hint: "Focus on the tablet.",
    difficulty: "medium",
    category: "architecture",
    image: {
        url: "https://images.unsplash.com/photo-1503575689137-5dc338426774?q=80&w=600&h=600&fit=crop",
        hint: "new-york usa"
    }
  },
  {
    id: "lvl_004",
    place: "Taj Mahal",
    country: "India",
    facts: [
      "It is a perfectly symmetrical building; an identical mosque and guesthouse flank the main mausoleum.",
      "The four minarets are slightly tilted outwards to protect the main tomb from damage if they were to collapse.",
      "Over 1,000 elephants were used to transport building materials during its construction."
    ],
    hint: "Look at the central dome.",
    difficulty: "medium",
    category: "architecture",
    image: {
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&h=600&fit=crop",
        hint: "agra india"
    }
  },
  {
    id: "lvl_005",
    place: "Machu Picchu",
    country: "Peru",
    facts: [
        "It was built around 1450, at the height of the Inca Empire.",
        "The site was abandoned just over 100 years later, at the time of the Spanish conquest.",
        "It's constructed of dry-stone walls, where builders cut stones to fit so tightly together that no mortar was needed."
    ],
    hint: "Focus on the main structures.",
    difficulty: "hard",
    category: "nature",
    image: {
        url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&h=600&fit=crop",
        hint: "peru inca"
    }
  },
  {
    id: "lvl_006",
    place: "Great Wall of China",
    country: "China",
    facts: [
        "It is not a single continuous wall but a system of walls, watchtowers, fortresses, and other defenses.",
        "Sticky rice flour was used in the binding material for the bricks, a testament to early bio-engineering.",
        "While it's the longest man-made structure, it is not, as is commonly believed, visible from the moon with the naked eye."
    ],
    hint: "Look at the path of the wall.",
    difficulty: "hard",
    category: "nature",
    image: {
        url: "https://images.unsplash.com/photo-1508804185872-d7bad5d59b35?q=80&w=600&h=600&fit=crop",
        hint: "china wall"
    }
  },
  {
    id: "lvl_007",
    place: "Petra",
    country: "Jordan",
    facts: [
        "It's known as the 'Rose City' due to the color of the stone from which it is carved.",
        "At its peak, the city was a bustling trade hub, controlling a major crossroads between Arabia, Egypt, and Syria-Phoenicia.",
        "Only about 15% of the city has been uncovered by archaeologists; the other 85% remains underground and untouched."
    ],
    hint: "Focus on the main Treasury building.",
    difficulty: "expert",
    category: "architecture",
    image: {
        url: "https://images.unsplash.com/photo-1559928230-b7de0badc5b2?q=80&w=600&h=600&fit=crop",
        hint: "jordan petra"
    }
  },
  {
    id: "lvl_008",
    place: "Christ the Redeemer",
    country: "Brazil",
    facts: [
        "The statue is considered the largest Art Deco-style sculpture in the world.",
        "It has been struck by lightning multiple times, with a 2014 strike damaging the statue's thumb.",
        "The outer layers are composed of 6 million soapstone tiles, chosen for their durability and ease of use."
    ],
    hint: "Look at the statue's arms.",
    difficulty: "expert",
    category: "architecture",
    image: {
        url: "https://images.unsplash.com/photo-1593457316828-77d0c3741b1d?q=80&w=600&h=600&fit=crop",
        hint: "brazil rio"
    }
  },
  {
    id: "lvl_009",
    place: "Pyramids of Giza",
    country: "Egypt",
    facts: [
        "The Great Pyramid of Giza was the tallest man-made structure in the world for more than 3,800 years.",
        "The three pyramids are precisely aligned with the stars of Orion's Belt.",
        "The construction of the Great Pyramid is estimated to have involved 100,000 workers and 2.3 million stone blocks."
    ],
    hint: "Focus on the alignment of the pyramids.",
    difficulty: "master",
    category: "nature",
    image: {
        url: "https://images.unsplash.com/photo-1572094389608-5173cb4321ac?q=80&w=600&h=600&fit=crop",
        hint: "egypt pyramids"
    }
  },
  {
    id: "lvl_010",
    place: "Sydney Opera House",
    country: "Australia",
    facts: [
        "The design was chosen from an international competition with 233 entries from 32 countries.",
        "The roof is covered with 1,056,000 tiles in two colors: glossy white and matte cream.",
        "It has its own seawater cooling system, using water taken directly from the harbor."
    ],
    hint: "Look at the 'sails' of the roof.",
    difficulty: "insane",
    category: "architecture",
    image: {
        url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&h=600&fit=crop",
        hint: "sydney australia"
    }
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
