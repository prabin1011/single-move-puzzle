
'use client';

export type WordRelationType =
  | 'synonym'
  | 'antonym'
  | 'category'
  | 'plural'
  | 'past_tense'
  | 'noun_adj'
  | 'analogy'
  | 'function';

export interface WordPair {
  left: string;
  right: string; // correct matching word
}

export interface WordBank {
  id: string;
  relation: WordRelationType;
  label: string;
  pairs: WordPair[];
}

export interface WordSwapLevelConfig {
  level: number; // 1..100
  concept: string;
  relation: WordRelationType;
  hint: string;
  bankId: string;
  itemsPerPuzzle: number; // how many pairs appear on the board (e.g. 3, 4, or 5)
}

export interface WordSwapPuzzle {
    id: string;
    pairs: { left: string; right: string }[];
    solutionIndices: [number, number];
}

// --------------------------------------------------------
// WORD BANKS
// --------------------------------------------------------

export const bankSynEasy: WordBank = {
  id: 'syn_easy',
  relation: 'synonym',
  label: 'Easy Synonyms – basic adjectives & common words',
  pairs: [
    { left: 'big', right: 'large' }, { left: 'small', right: 'tiny' },
    { left: 'fast', right: 'quick' }, { left: 'smart', right: 'clever' },
    { left: 'angry', right: 'mad' }, { left: 'happy', right: 'glad' },
    { left: 'sad', right: 'unhappy' }, { left: 'easy', right: 'simple' },
    { left: 'hard', right: 'difficult' }, { left: 'rich', right: 'wealthy' },
    { left: 'poor', right: 'needy' }, { left: 'quiet', right: 'silent' },
    { left: 'loud', right: 'noisy' }, { left: 'brave', right: 'courageous' },
    { left: 'scared', right: 'afraid' }, { left: 'beautiful', right: 'pretty' },
    { left: 'ugly', right: 'unattractive' }, { left: 'strong', right: 'powerful' },
    { left: 'weak', right: 'frail' }, { left: 'cold', right: 'chilly' },
    { left: 'hot', right: 'warm' }, { left: 'tired', right: 'exhausted' },
    { left: 'funny', right: 'humorous' }, { left: 'boring', right: 'dull' },
    { left: 'right', right: 'correct' }, { left: 'wrong', right: 'incorrect' },
    { left: 'near', right: 'close' }, { left: 'far', right: 'distant' },
    { left: 'old', right: 'ancient' }, { left: 'new', right: 'recent' },
  ],
};

export const bankSynVerbs: WordBank = {
  id: 'syn_verbs',
  relation: 'synonym',
  label: 'Action verb synonyms',
  pairs: [
    { left: 'run', right: 'sprint' }, { left: 'walk', right: 'stroll' },
    { left: 'speak', right: 'talk' }, { left: 'shout', right: 'yell' },
    { left: 'look', right: 'glance' }, { left: 'see', right: 'notice' },
    { left: 'eat', right: 'consume' }, { left: 'drink', right: 'sip' },
    { left: 'start', right: 'begin' }, { left: 'end', right: 'finish' },
    { left: 'help', right: 'assist' }, { left: 'fix', right: 'repair' },
    { left: 'break', right: 'smash' }, { left: 'push', right: 'press' },
    { left: 'pull', right: 'drag' }, { left: 'throw', right: 'toss' },
    { left: 'catch', right: 'grab' }, { left: 'build', right: 'construct' },
    { left: 'destroy', right: 'ruin' }, { left: 'choose', right: 'select' },
    { left: 'show', right: 'display' }, { left: 'hide', right: 'conceal' },
    { left: 'buy', right: 'purchase' }, { left: 'sell', right: 'trade' },
    { left: 'call', right: 'phone' }, { left: 'write', right: 'compose' },
    { left: 'drive', right: 'steer' }, { left: 'learn', right: 'study' },
    { left: 'teach', right: 'educate' }, { left: 'wait', right: 'pause' },
  ],
};

export const bankSynEmotion: WordBank = {
  id: 'syn_emotion',
  relation: 'synonym',
  label: 'Emotion synonyms',
  pairs: [
    { left: 'happy', right: 'joyful' }, { left: 'sad', right: 'downcast' },
    { left: 'angry', right: 'furious' }, { left: 'afraid', right: 'terrified' },
    { left: 'calm', right: 'peaceful' }, { left: 'excited', right: 'thrilled' },
    { left: 'bored', right: 'disinterested' }, { left: 'confused', right: 'puzzled' },
    { left: 'surprised', right: 'shocked' }, { left: 'proud', right: 'pleased' },
    { left: 'ashamed', right: 'embarrassed' }, { left: 'jealous', right: 'envious' },
    { left: 'lonely', right: 'isolated' }, { left: 'grateful', right: 'thankful' },
    { left: 'hopeful', right: 'optimistic' }, { left: 'hopeless', right: 'despairing' },
    { left: 'relaxed', right: 'at ease' }, { left: 'stressed', right: 'tense' },
    { left: 'curious', right: 'inquisitive' }, { left: 'annoyed', right: 'irritated' },
  ],
};

export const bankAntBasic: WordBank = {
  id: 'ant_basic',
  relation: 'antonym',
  label: 'Simple opposite pairs',
  pairs: [
    { left: 'hot', right: 'cold' }, { left: 'up', right: 'down' },
    { left: 'left', right: 'right' }, { left: 'in', right: 'out' },
    { left: 'open', right: 'closed' }, { left: 'light', right: 'dark' },
    { left: 'day', right: 'night' }, { left: 'young', right: 'old' },
    { left: 'fast', right: 'slow' }, { left: 'early', right: 'late' },
    { left: 'full', right: 'empty' }, { left: 'clean', right: 'dirty' },
    { left: 'strong', right: 'weak' }, { left: 'rich', right: 'poor' },
    { left: 'near', right: 'far' }, { left: 'start', right: 'stop' },
    { left: 'yes', right: 'no' }, { left: 'true', right: 'false' },
    { left: 'big', right: 'small' }, { left: 'happy', right: 'sad' },
  ],
};

export const bankAntEmotion: WordBank = {
  id: 'ant_emotion',
  relation: 'antonym',
  label: 'Emotional opposites',
  pairs: [
    { left: 'brave', right: 'cowardly' }, { left: 'confident', right: 'insecure' },
    { left: 'hopeful', right: 'hopeless' }, { left: 'calm', right: 'anxious' },
    { left: 'kind', right: 'cruel' }, { left: 'polite', right: 'rude' },
    { left: 'honest', right: 'dishonest' }, { left: 'loyal', right: 'disloyal' },
    { left: 'patient', right: 'impatient' }, { left: 'generous', right: 'selfish' },
    { left: 'friendly', right: 'hostile' }, { left: 'relaxed', right: 'stressed' },
    { left: 'cheerful', right: 'gloomy' }, { left: 'curious', right: 'indifferent' },
    { left: 'proud', right: 'ashamed' }, { left: 'grateful', right: 'ungrateful' },
    { left: 'forgiving', right: 'resentful' }, { left: 'optimistic', right: 'pessimistic' },
    { left: 'energetic', right: 'tired' }, { left: 'secure', right: 'afraid' },
  ],
};

export const bankAntAbstract: WordBank = {
  id: 'ant_abstract',
  relation: 'antonym',
  label: 'Abstract / concept opposites',
  pairs: [
    { left: 'success', right: 'failure' }, { left: 'victory', right: 'defeat' },
    { left: 'gain', right: 'loss' }, { left: 'growth', right: 'decline' },
    { left: 'increase', right: 'decrease' }, { left: 'expand', right: 'shrink' },
    { left: 'accept', right: 'reject' }, { left: 'include', right: 'exclude' },
    { left: 'create', right: 'destroy' }, { left: 'order', right: 'chaos' },
    { left: 'peace', right: 'war' }, { left: 'freedom', right: 'prison' },
    { left: 'truth', right: 'lie' }, { left: 'logic', right: 'nonsense' },
    { left: 'justice', right: 'injustice' }, { left: 'safety', right: 'danger' },
    { left: 'profit', right: 'loss' }, { left: 'win', right: 'lose' },
    { left: 'hope', right: 'despair' }, { left: 'calm', right: 'panic' },
  ],
};

export const bankCategoryObjects: WordBank = {
  id: 'cat_objects',
  relation: 'category',
  label: 'Object to category',
  pairs: [
    { left: 'apple', right: 'fruit' }, { left: 'banana', right: 'fruit' },
    { left: 'tomato', right: 'vegetable' }, { left: 'carrot', right: 'vegetable' },
    { left: 'dog', right: 'animal' }, { left: 'cat', right: 'animal' },
    { left: 'eagle', right: 'bird' }, { left: 'sparrow', right: 'bird' },
    { left: 'salmon', right: 'fish' }, { left: 'shark', right: 'fish' },
    { left: 'rose', right: 'flower' }, { left: 'lotus', right: 'flower' },
    { left: 'chair', right: 'furniture' }, { left: 'table', right: 'furniture' },
    { left: 'spoon', right: 'utensil' }, { left: 'fork', right: 'utensil' },
    { left: 'guitar', right: 'instrument' }, { left: 'piano', right: 'instrument' },
    { left: 'bus', right: 'vehicle' }, { left: 'bicycle', right: 'vehicle' },
  ],
};

export const bankCategoryTimePlace: WordBank = {
  id: 'cat_time_place',
  relation: 'category',
  label: 'Time and place categories',
  pairs: [
    { left: 'winter', right: 'season' }, { left: 'spring', right: 'season' },
    { left: 'morning', right: 'time of day' }, { left: 'evening', right: 'time of day' },
    { left: 'Monday', right: 'weekday' }, { left: 'Sunday', right: 'weekend' },
    { left: 'January', right: 'month' }, { left: 'July', right: 'month' },
    { left: 'Kathmandu', right: 'city' }, { left: 'Delhi', right: 'city' },
    { left: 'Nepal', right: 'country' }, { left: 'India', right: 'country' },
    { left: 'Everest', right: 'mountain' }, { left: 'Fewa', right: 'lake' },
    { left: 'Bagmati', right: 'river' }, { left: 'Sahara', right: 'desert' },
    { left: 'Pacific', right: 'ocean' }, { left: 'Himalaya', right: 'mountain range' },
    { left: 'school', right: 'building' }, { left: 'hospital', right: 'building' },
  ],
};

export const bankCategoryAbstract: WordBank = {
  id: 'cat_abstract',
  relation: 'category',
  label: 'Abstract, role and concept categories',
  pairs: [
    { left: 'doctor', right: 'profession' }, { left: 'teacher', right: 'profession' },
    { left: 'engineer', right: 'profession' }, { left: 'student', right: 'role' },
    { left: 'parent', right: 'role' }, { left: 'friend', right: 'relationship' },
    { left: 'enemy', right: 'relationship' }, { left: 'happiness', right: 'emotion' },
    { left: 'fear', right: 'emotion' }, { left: 'love', right: 'emotion' },
    { left: 'democracy', right: 'system' }, { left: 'monarchy', right: 'system' },
    { left: 'cricket', right: 'sport' }, { left: 'football', right: 'sport' },
    { left: 'yoga', right: 'practice' }, { left: 'meditation', right: 'practice' },
    { left: 'Buddhism', right: 'religion' }, { left: 'Hinduism', right: 'religion' },
    { left: 'gravity', right: 'force' }, { left: 'electricity', right: 'energy' },
  ],
};

export const bankPlural: WordBank = {
  id: 'plural_forms',
  relation: 'plural',
  label: 'Singular to plural forms',
  pairs: [
    { left: 'child', right: 'children' }, { left: 'mouse', right: 'mice' },
    { left: 'person', right: 'people' }, { left: 'foot', right: 'feet' },
    { left: 'tooth', right: 'teeth' }, { left: 'man', right: 'men' },
    { left: 'woman', right: 'women' }, { left: 'leaf', right: 'leaves' },
    { left: 'knife', right: 'knives' }, { left: 'city', right: 'cities' },
    { left: 'baby', right: 'babies' }, { left: 'box', right: 'boxes' },
    { left: 'bus', right: 'buses' }, { left: 'hero', right: 'heroes' },
    { left: 'potato', right: 'potatoes' }, { left: 'tomato', right: 'tomatoes' },
    { left: 'cat', right: 'cats' }, { left: 'dog', right: 'dogs' },
    { left: 'book', right: 'books' }, { left: 'house', right: 'houses' },
  ],
};

export const bankPastTense: WordBank = {
  id: 'past_tense',
  relation: 'past_tense',
  label: 'Base verb to past tense',
  pairs: [
    { left: 'go', right: 'went' }, { left: 'come', right: 'came' },
    { left: 'see', right: 'saw' }, { left: 'eat', right: 'ate' },
    { left: 'drink', right: 'drank' }, { left: 'take', right: 'took' },
    { left: 'give', right: 'gave' }, { left: 'write', right: 'wrote' },
    { left: 'read', right: 'read' }, { left: 'run', right: 'ran' },
    { left: 'sing', right: 'sang' }, { left: 'sit', right: 'sat' },
    { left: 'stand', right: 'stood' }, { left: 'sleep', right: 'slept' },
    { left: 'buy', right: 'bought' }, { left: 'think', right: 'thought' },
    { left: 'teach', right: 'taught' }, { left: 'learn', right: 'learned' },
    { left: 'play', right: 'played' }, { left: 'work', right: 'worked' },
  ],
};

export const bankNounAdj: WordBank = {
  id: 'noun_adj',
  relation: 'noun_adj',
  label: 'Noun to adjective form',
  pairs: [
    { left: 'danger', right: 'dangerous' }, { left: 'beauty', right: 'beautiful' },
    { left: 'power', right: 'powerful' }, { left: 'pain', right: 'painful' },
    { left: 'hope', right: 'hopeful' }, { left: 'use', right: 'useful' },
    { left: 'skill', right: 'skilled' }, { left: 'success', right: 'successful' },
    { left: 'peace', right: 'peaceful' }, { left: 'sun', right: 'sunny' },
    { left: 'rain', right: 'rainy' }, { left: 'cloud', right: 'cloudy' },
    { left: 'storm', right: 'stormy' }, { left: 'care', right: 'careful' },
    { left: 'joy', right: 'joyful' }, { left: 'luck', right: 'lucky' },
    { left: 'energy', right: 'energetic' }, { left: 'health', right: 'healthy' },
    { left: 'noise', right: 'noisy' }, { left: 'anger', right: 'angry' },
  ],
};

export const bankAnalogy: WordBank = {
  id: 'analogy_basic',
  relation: 'analogy',
  label: 'Simple analogies',
  pairs: [
    { left: 'bird : fly', right: 'fish : swim' }, { left: 'cat : meow', right: 'dog : bark' },
    { left: 'eye : see', right: 'ear : hear' }, { left: 'knife : cut', right: 'pen : write' },
    { left: 'teacher : school', right: 'doctor : hospital' }, { left: 'sun : day', right: 'moon : night' },
    { left: 'lock : key', right: 'question : answer' }, { left: 'fire : hot', right: 'ice : cold' },
    { left: 'nose : smell', right: 'tongue : taste' }, { left: 'seed : tree', right: 'egg : bird' },
    { left: 'pilot : plane', right: 'driver : car' }, { left: 'author : book', right: 'painter : painting' },
    { left: 'runner : race', right: 'singer : song' }, { left: 'earth : planet', right: 'sun : star' },
    { left: 'Nepal : country', right: 'Kathmandu : city' }, { left: 'question : ask', right: 'answer : tell' },
    { left: 'cause : effect', right: 'push : move' }, { left: 'cloud : rain', right: 'smoke : fire' },
    { left: 'problem : solution', right: 'illness : cure' }, { left: 'student : learn', right: 'teacher : teach' },
  ],
};

export const bankFunction: WordBank = {
  id: 'function',
  relation: 'function',
  label: 'Object and its function',
  pairs: [
    { left: 'umbrella', right: 'keep dry' }, { left: 'knife', right: 'cut food' },
    { left: 'chair', right: 'sit on' }, { left: 'pillow', right: 'rest head' },
    { left: 'key', right: 'open lock' }, { left: 'phone', right: 'make calls' },
    { left: 'clock', right: 'tell time' }, { left: 'map', right: 'show directions' },
    { left: 'bottle', right: 'hold water' }, { left: 'pen', right: 'write words' },
    { left: 'camera', right: 'take photos' }, { left: 'mirror', right: 'show reflection' },
    { left: 'helmet', right: 'protect head' }, { left: 'glasses', right: 'improve vision' },
    { left: 'oven', right: 'bake food' }, { left: 'fridge', right: 'keep food cold' },
    { left: 'bag', right: 'carry things' }, { left: 'broom', right: 'clean floor' },
    { left: 'soap', right: 'wash hands' }, { left: 'toothbrush', right: 'clean teeth' },
  ],
};

export const bankAnalogyHard: WordBank = {
  id: 'analogy_hard',
  relation: 'analogy',
  label: 'Harder, more abstract analogies',
  pairs: [
    { left: 'seed : tree', right: 'idea : project' }, { left: 'foundation : building', right: 'roots : tree' },
    { left: 'training : athlete', right: 'practice : musician' }, { left: 'question : curiosity', right: 'exercise : health' },
    { left: 'map : travel', right: 'recipe : cooking' }, { left: 'battery : phone', right: 'fuel : car' },
    { left: 'rain : flood', right: 'sun : drought' }, { left: 'goal : direction', right: 'compass : path' },
    { left: 'key : door', right: 'password : account' }, { left: 'mistake : learning', right: 'failure : growth' },
    { left: 'rule : order', right: 'law : society' }, { left: 'gravity : falling', right: 'friction : slowing' },
    { left: 'shield : protection', right: 'mask : safety' }, { left: 'root : support', right: 'spine : body' },
    { left: 'teacher : guide', right: 'coach : mentor' }, { left: 'sun : energy', right: 'water : life' },
    { left: 'memory : past', right: 'plan : future' }, { left: 'habit : routine', right: 'ritual : tradition' },
    { left: 'storm : danger', right: 'medicine : healing' }, { left: 'code : program', right: 'notes : music' },
  ],
};

const allBanks: Record<string, WordBank> = {
    [bankSynEasy.id]: bankSynEasy, [bankSynVerbs.id]: bankSynVerbs,
    [bankSynEmotion.id]: bankSynEmotion, [bankAntBasic.id]: bankAntBasic,
    [bankAntEmotion.id]: bankAntEmotion, [bankAntAbstract.id]: bankAntAbstract,
    [bankCategoryObjects.id]: bankCategoryObjects, [bankCategoryTimePlace.id]: bankCategoryTimePlace,
    [bankCategoryAbstract.id]: bankCategoryAbstract, [bankPlural.id]: bankPlural,
    [bankPastTense.id]: bankPastTense, [bankNounAdj.id]: bankNounAdj,
    [bankAnalogy.id]: bankAnalogy, [bankFunction.id]: bankFunction,
    [bankAnalogyHard.id]: bankAnalogyHard,
};

// --------------------------------------------------------
// LEVEL CONFIGS
// --------------------------------------------------------

export const wordSwapLevels: WordSwapLevelConfig[] = [
  // Levels 1-10: Synonyms
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    concept: i < 5 ? 'Easy Synonyms' : 'Verb Synonyms',
    relation: 'synonym' as WordRelationType,
    hint: 'Match each word with another that has a similar meaning.',
    bankId: i < 5 ? 'syn_easy' : 'syn_verbs',
    itemsPerPuzzle: i < 3 ? 3 : 4,
  })),
  // Levels 11-20: Antonyms
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 11,
    concept: i < 5 ? 'Simple Opposites' : 'Emotional Opposites',
    relation: 'antonym' as WordRelationType,
    hint: 'Find the word that means the opposite.',
    bankId: i < 5 ? 'ant_basic' : 'ant_emotion',
    itemsPerPuzzle: i < 3 ? 3 : 4,
  })),
  // Levels 21-30: Categories
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 21,
    concept: i < 5 ? 'Object Categories' : 'Abstract Categories',
    relation: 'category' as WordRelationType,
    hint: 'Match the item to the group it belongs to.',
    bankId: i < 5 ? 'cat_objects' : 'cat_abstract',
    itemsPerPuzzle: i < 3 ? 3 : 4,
  })),
  // Levels 31-40: Word Forms
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 31,
    concept: i < 5 ? 'Plural Forms' : 'Past Tense',
    relation: i < 5 ? ('plural' as WordRelationType) : ('past_tense' as WordRelationType),
    hint: 'Match the word to its correct grammatical form.',
    bankId: i < 5 ? 'plural_forms' : 'past_tense',
    itemsPerPuzzle: 4,
  })),
  // Levels 41-50: Analogies
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 41,
    concept: 'Analogies',
    relation: 'analogy' as WordRelationType,
    hint: 'Complete the relationship: A is to B as C is to...?',
    bankId: i < 5 ? 'analogy_basic' : 'analogy_hard',
    itemsPerPuzzle: 4,
  })),
  // Levels 51-60: Noun to Adjective
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 51,
    concept: 'Noun to Adjective',
    relation: 'noun_adj' as WordRelationType,
    hint: 'Match the noun to its adjective form (e.g., beauty -> beautiful).',
    bankId: 'noun_adj',
    itemsPerPuzzle: i < 5 ? 4 : 5,
  })),
  // Levels 61-70: Object and Function
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 61,
    concept: 'Object & Function',
    relation: 'function' as WordRelationType,
    hint: 'Match the object to what it is used for.',
    bankId: 'function',
    itemsPerPuzzle: i < 5 ? 4 : 5,
  })),
  // Levels 71-80: Advanced Categories
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 71,
    concept: 'Advanced Categories',
    relation: 'category' as WordRelationType,
    hint: 'Group abstract concepts, roles, and ideas.',
    bankId: 'cat_abstract',
    itemsPerPuzzle: 5,
  })),
  // Levels 81-90: Advanced Antonyms
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 81,
    concept: 'Abstract Opposites',
    relation: 'antonym' as WordRelationType,
    hint: 'Find the opposite of complex ideas and concepts.',
    bankId: 'ant_abstract',
    itemsPerPuzzle: 5,
  })),
  // Levels 91-100: Hard Analogies
  ...Array.from({ length: 10 }, (_, i) => ({
    level: i + 91,
    concept: 'Hard Analogies',
    relation: 'analogy' as WordRelationType,
    hint: 'These relationships are abstract. Think about cause/effect and symbolic links.',
    bankId: 'analogy_hard',
    itemsPerPuzzle: 5,
  })),
];

// --------------------------------------------------------
// PUBLIC API
// --------------------------------------------------------

export function getWordSwapLevelConfig(levelIndex: number): WordSwapLevelConfig {
    const clampedIndex = Math.max(0, Math.min(levelIndex, wordSwapLevels.length - 1));
    return wordSwapLevels[clampedIndex];
}

function shuffleAndTake<T>(array: T[], count: number): T[] {
  const copy = [...array];
  // Fisher–Yates shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function generatePuzzle(levelIndex: number, retryCount: number): WordSwapPuzzle {
  const config = getWordSwapLevelConfig(levelIndex);
  const bank = allBanks[config.bankId];
  if (!bank) {
    throw new Error(`Word bank with id "${config.bankId}" not found.`);
  }

  // 1) Randomly pick pairs for this puzzle
  const puzzlePairs = shuffleAndTake(bank.pairs, config.itemsPerPuzzle);

  // 2) Clone for scrambling
  const scrambledPairs = puzzlePairs.map(p => ({ ...p }));

  // 3) Randomly choose two **different** rows to swap
  const len = scrambledPairs.length;
  let idx1 = Math.floor(Math.random() * len);
  let idx2 = Math.floor(Math.random() * len);
  while (idx2 === idx1) {
    idx2 = Math.floor(Math.random() * len);
  }

  // 4) Swap the right-sides
  [scrambledPairs[idx1].right, scrambledPairs[idx2].right] = [
    scrambledPairs[idx2].right,
    scrambledPairs[idx1].right,
  ];

  return {
    id: `L${levelIndex + 1}-V${Date.now()}-${retryCount}`, // ensure React remounts PuzzleBoard
    pairs: scrambledPairs,
    solutionIndices: [idx1, idx2],
  };
}
