
'use client';

import { number } from "zod";

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
  level: number; // 1..50
  concept: string;
  relation: WordRelationType;
  hint: string;
  bankId: string;
  itemsPerPuzzle: number; // how many pairs appear on the board (e.g. 3 or 4)
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
    { left: 'big', right: 'large' },
    { left: 'small', right: 'tiny' },
    { left: 'fast', right: 'quick' },
    { left: 'smart', right: 'clever' },
    { left: 'angry', right: 'mad' },
    { left: 'happy', right: 'glad' },
    { left: 'sad', right: 'unhappy' },
    { left: 'easy', right: 'simple' },
    { left: 'hard', right: 'difficult' },
    { left: 'rich', right: 'wealthy' },
    { left: 'poor', right: 'needy' },
    { left: 'quiet', right: 'silent' },
    { left: 'loud', right: 'noisy' },
    { left: 'brave', right: 'courageous' },
    { left: 'scared', right: 'afraid' },
    { left: 'beautiful', right: 'pretty' },
    { left: 'ugly', right: 'unattractive' },
    { left: 'strong', right: 'powerful' },
    { left: 'weak', right: 'frail' },
    { left: 'cold', right: 'chilly' },
    { left: 'hot', right: 'warm' },
    { left: 'tired', right: 'exhausted' },
    { left: 'funny', right: 'humorous' },
    { left: 'boring', right: 'dull' },
    { left: 'right', right: 'correct' },
    { left: 'wrong', right: 'incorrect' },
    { left: 'near', right: 'close' },
    { left: 'far', right: 'distant' },
    { left: 'old', right: 'ancient' },
    { left: 'new', right: 'recent' },
  ],
};

export const bankSynVerbs: WordBank = {
  id: 'syn_verbs',
  relation: 'synonym',
  label: 'Action verb synonyms',
  pairs: [
    { left: 'run', right: 'sprint' },
    { left: 'walk', right: 'stroll' },
    { left: 'speak', right: 'talk' },
    { left: 'shout', right: 'yell' },
    { left: 'look', right: 'glance' },
    { left: 'see', right: 'notice' },
    { left: 'eat', right: 'consume' },
    { left: 'drink', right: 'sip' },
    { left: 'start', right: 'begin' },
    { left: 'end', right: 'finish' },
    { left: 'help', right: 'assist' },
    { left: 'fix', right: 'repair' },
    { left: 'break', right: 'smash' },
    { left: 'push', right: 'press' },
    { left: 'pull', right: 'drag' },
    { left: 'throw', right: 'toss' },
    { left: 'catch', right: 'grab' },
    { left: 'build', right: 'construct' },
    { left: 'destroy', right: 'ruin' },
    { left: 'choose', right: 'select' },
    { left: 'show', right: 'display' },
    { left: 'hide', right: 'conceal' },
    { left: 'buy', right: 'purchase' },
    { left: 'sell', right: 'trade' },
    { left: 'call', right: 'phone' },
    { left: 'write', right: 'compose' },
    { left: 'drive', right: 'steer' },
    { left: 'learn', right: 'study' },
    { left: 'teach', right: 'educate' },
    { left: 'wait', right: 'pause' },
  ],
};

export const bankSynEmotion: WordBank = {
  id: 'syn_emotion',
  relation: 'synonym',
  label: 'Emotion synonyms',
  pairs: [
    { left: 'happy', right: 'joyful' },
    { left: 'sad', right: 'downcast' },
    { left: 'angry', right: 'furious' },
    { left: 'afraid', right: 'terrified' },
    { left: 'calm', right: 'peaceful' },
    { left: 'excited', right: 'thrilled' },
    { left: 'bored', right: 'disinterested' },
    { left: 'confused', right: 'puzzled' },
    { left: 'surprised', right: 'shocked' },
    { left: 'proud', right: 'pleased' },
    { left: 'ashamed', right: 'embarrassed' },
    { left: 'jealous', right: 'envious' },
    { left: 'lonely', right: 'isolated' },
    { left: 'grateful', right: 'thankful' },
    { left: 'hopeful', right: 'optimistic' },
    { left: 'hopeless', right: 'despairing' },
    { left: 'relaxed', right: 'at ease' },
    { left: 'stressed', right: 'tense' },
    { left: 'curious', right: 'inquisitive' },
    { left: 'annoyed', right: 'irritated' },
  ],
};

export const bankAntBasic: WordBank = {
  id: 'ant_basic',
  relation: 'antonym',
  label: 'Simple opposite pairs',
  pairs: [
    { left: 'hot', right: 'cold' },
    { left: 'up', right: 'down' },
    { left: 'left', right: 'right' },
    { left: 'in', right: 'out' },
    { left: 'open', right: 'closed' },
    { left: 'light', right: 'dark' },
    { left: 'day', right: 'night' },
    { left: 'young', right: 'old' },
    { left: 'fast', right: 'slow' },
    { left: 'early', right: 'late' },
    { left: 'full', right: 'empty' },
    { left: 'clean', right: 'dirty' },
    { left: 'strong', right: 'weak' },
    { left: 'rich', right: 'poor' },
    { left: 'near', right: 'far' },
    { left: 'start', right: 'stop' },
    { left: 'yes', right: 'no' },
    { left: 'true', right: 'false' },
    { left: 'big', right: 'small' },
    { left: 'happy', right: 'sad' },
  ],
};

export const bankAntEmotion: WordBank = {
  id: 'ant_emotion',
  relation: 'antonym',
  label: 'Emotional opposites',
  pairs: [
    { left: 'brave', right: 'cowardly' },
    { left: 'confident', right: 'insecure' },
    { left: 'hopeful', right: 'hopeless' },
    { left: 'calm', right: 'anxious' },
    { left: 'kind', right: 'cruel' },
    { left: 'polite', right: 'rude' },
    { left: 'honest', right: 'dishonest' },
    { left: 'loyal', right: 'disloyal' },
    { left: 'patient', right: 'impatient' },
    { left: 'generous', right: 'selfish' },
    { left: 'friendly', right: 'hostile' },
    { left: 'relaxed', right: 'stressed' },
    { left: 'cheerful', right: 'gloomy' },
    { left: 'curious', right: 'indifferent' },
    { left: 'proud', right: 'ashamed' },
    { left: 'grateful', right: 'ungrateful' },
    { left: 'forgiving', right: 'resentful' },
    { left: 'optimistic', right: 'pessimistic' },
    { left: 'energetic', right: 'tired' },
    { left: 'secure', right: 'afraid' },
  ],
};

export const bankAntAbstract: WordBank = {
  id: 'ant_abstract',
  relation: 'antonym',
  label: 'Abstract / concept opposites',
  pairs: [
    { left: 'success', right: 'failure' },
    { left: 'victory', right: 'defeat' },
    { left: 'gain', right: 'loss' },
    { left: 'growth', right: 'decline' },
    { left: 'increase', right: 'decrease' },
    { left: 'expand', right: 'shrink' },
    { left: 'accept', right: 'reject' },
    { left: 'include', right: 'exclude' },
    { left: 'create', right: 'destroy' },
    { left: 'order', right: 'chaos' },
    { left: 'peace', right: 'war' },
    { left: 'freedom', right: 'prison' },
    { left: 'truth', right: 'lie' },
    { left: 'logic', right: 'nonsense' },
    { left: 'justice', right: 'injustice' },
    { left: 'safety', right: 'danger' },
    { left: 'profit', right: 'loss' },
    { left: 'win', right: 'lose' },
    { left: 'hope', right: 'despair' },
    { left: 'calm', right: 'panic' },
  ],
};

export const bankCategoryObjects: WordBank = {
  id: 'cat_objects',
  relation: 'category',
  label: 'Object to category',
  pairs: [
    { left: 'apple', right: 'fruit' },
    { left: 'banana', right: 'fruit' },
    { left: 'tomato', right: 'vegetable' },
    { left: 'carrot', right: 'vegetable' },
    { left: 'dog', right: 'animal' },
    { left: 'cat', right: 'animal' },
    { left: 'eagle', right: 'bird' },
    { left: 'sparrow', right: 'bird' },
    { left: 'salmon', right: 'fish' },
    { left: 'shark', right: 'fish' },
    { left: 'rose', right: 'flower' },
    { left: 'lotus', right: 'flower' },
    { left: 'chair', right: 'furniture' },
    { left: 'table', right: 'furniture' },
    { left: 'spoon', right: 'utensil' },
    { left: 'fork', right: 'utensil' },
    { left: 'guitar', right: 'instrument' },
    { left: 'piano', right: 'instrument' },
    { left: 'bus', right: 'vehicle' },
    { left: 'bicycle', right: 'vehicle' },
  ],
};

export const bankCategoryTimePlace: WordBank = {
  id: 'cat_time_place',
  relation: 'category',
  label: 'Time and place categories',
  pairs: [
    { left: 'winter', right: 'season' },
    { left: 'spring', right: 'season' },
    { left: 'morning', right: 'time of day' },
    { left: 'evening', right: 'time of day' },
    { left: 'Monday', right: 'weekday' },
    { left: 'Sunday', right: 'weekend' },
    { left: 'January', right: 'month' },
    { left: 'July', right: 'month' },
    { left: 'Kathmandu', right: 'city' },
    { left: 'Delhi', right: 'city' },
    { left: 'Nepal', right: 'country' },
    { left: 'India', right: 'country' },
    { left: 'Everest', right: 'mountain' },
    { left: 'Fewa', right: 'lake' },
    { left: 'Bagmati', right: 'river' },
    { left: 'Sahara', right: 'desert' },
    { left: 'Pacific', right: 'ocean' },
    { left: 'Himalaya', right: 'mountain range' },
    { left: 'school', right: 'building' },
    { left: 'hospital', right: 'building' },
  ],
};

export const bankCategoryAbstract: WordBank = {
  id: 'cat_abstract',
  relation: 'category',
  label: 'Abstract, role and concept categories',
  pairs: [
    { left: 'doctor', right: 'profession' },
    { left: 'teacher', right: 'profession' },
    { left: 'engineer', right: 'profession' },
    { left: 'student', right: 'role' },
    { left: 'parent', right: 'role' },
    { left: 'friend', right: 'relationship' },
    { left: 'enemy', right: 'relationship' },
    { left: 'happiness', right: 'emotion' },
    { left: 'fear', right: 'emotion' },
    { left: 'love', right: 'emotion' },
    { left: 'democracy', right: 'system' },
    { left: 'monarchy', right: 'system' },
    { left: 'cricket', right: 'sport' },
    { left: 'football', right: 'sport' },
    { left: 'yoga', right: 'practice' },
    { left: 'meditation', right: 'practice' },
    { left: 'Buddhism', right: 'religion' },
    { left: 'Hinduism', right: 'religion' },
    { left: 'gravity', right: 'force' },
    { left: 'electricity', right: 'energy' },
  ],
};

export const bankPlural: WordBank = {
  id: 'plural_forms',
  relation: 'plural',
  label: 'Singular to plural forms',
  pairs: [
    { left: 'child', right: 'children' },
    { left: 'mouse', right: 'mice' },
    { left: 'person', right: 'people' },
    { left: 'foot', right: 'feet' },
    { left: 'tooth', right: 'teeth' },
    { left: 'man', right: 'men' },
    { left: 'woman', right: 'women' },
    { left: 'leaf', right: 'leaves' },
    { left: 'knife', right: 'knives' },
    { left: 'city', right: 'cities' },
    { left: 'baby', right: 'babies' },
    { left: 'box', right: 'boxes' },
    { left: 'bus', right: 'buses' },
    { left: 'hero', right: 'heroes' },
    { left: 'potato', right: 'potatoes' },
    { left: 'tomato', right: 'tomatoes' },
    { left: 'cat', right: 'cats' },
    { left: 'dog', right: 'dogs' },
    { left: 'book', right: 'books' },
    { left: 'house', right: 'houses' },
  ],
};

export const bankPastTense: WordBank = {
  id: 'past_tense',
  relation: 'past_tense',
  label: 'Base verb to past tense',
  pairs: [
    { left: 'go', right: 'went' },
    { left: 'come', right: 'came' },
    { left: 'see', right: 'saw' },
    { left: 'eat', right: 'ate' },
    { left: 'drink', right: 'drank' },
    { left: 'take', right: 'took' },
    { left: 'give', right: 'gave' },
    { left: 'write', right: 'wrote' },
    { left: 'read', right: 'read' },
    { left: 'run', right: 'ran' },
    { left: 'sing', right: 'sang' },
    { left: 'sit', right: 'sat' },
    { left: 'stand', right: 'stood' },
    { left: 'sleep', right: 'slept' },
    { left: 'buy', right: 'bought' },
    { left: 'think', right: 'thought' },
    { left: 'teach', right: 'taught' },
    { left: 'learn', right: 'learned' },
    { left: 'play', right: 'played' },
    { left: 'work', right: 'worked' },
  ],
};

export const bankNounAdj: WordBank = {
  id: 'noun_adj',
  relation: 'noun_adj',
  label: 'Noun to adjective form',
  pairs: [
    { left: 'danger', right: 'dangerous' },
    { left: 'beauty', right: 'beautiful' },
    { left: 'power', right: 'powerful' },
    { left: 'pain', right: 'painful' },
    { left: 'hope', right: 'hopeful' },
    { left: 'use', right: 'useful' },
    { left: 'skill', right: 'skilled' },
    { left: 'success', right: 'successful' },
    { left: 'peace', right: 'peaceful' },
    { left: 'sun', right: 'sunny' },
    { left: 'rain', right: 'rainy' },
    { left: 'cloud', right: 'cloudy' },
    { left: 'storm', right: 'stormy' },
    { left: 'care', right: 'careful' },
    { left: 'joy', right: 'joyful' },
    { left: 'luck', right: 'lucky' },
    { left: 'energy', right: 'energetic' },
    { left: 'health', right: 'healthy' },
    { left: 'noise', right: 'noisy' },
    { left: 'anger', right: 'angry' },
  ],
};

export const bankAnalogy: WordBank = {
  id: 'analogy_basic',
  relation: 'analogy',
  label: 'Simple analogies',
  pairs: [
    { left: 'bird : fly', right: 'fish : swim' },
    { left: 'cat : meow', right: 'dog : bark' },
    { left: 'eye : see', right: 'ear : hear' },
    { left: 'knife : cut', right: 'pen : write' },
    { left: 'teacher : school', right: 'doctor : hospital' },
    { left: 'sun : day', right: 'moon : night' },
    { left: 'lock : key', right: 'question : answer' },
    { left: 'fire : hot', right: 'ice : cold' },
    { left: 'nose : smell', right: 'tongue : taste' },
    { left: 'seed : tree', right: 'egg : bird' },
    { left: 'pilot : plane', right: 'driver : car' },
    { left: 'author : book', right: 'painter : painting' },
    { left: 'runner : race', right: 'singer : song' },
    { left: 'earth : planet', right: 'sun : star' },
    { left: 'Nepal : country', right: 'Kathmandu : city' },
    { left: 'question : ask', right: 'answer : tell' },
    { left: 'cause : effect', right: 'push : move' },
    { left: 'cloud : rain', right: 'smoke : fire' },
    { left: 'problem : solution', right: 'illness : cure' },
    { left: 'student : learn', right: 'teacher : teach' },
  ],
};

export const bankFunction: WordBank = {
  id: 'function',
  relation: 'function',
  label: 'Object and its function',
  pairs: [
    { left: 'umbrella', right: 'keep dry' },
    { left: 'knife', right: 'cut food' },
    { left: 'chair', right: 'sit on' },
    { left: 'pillow', right: 'rest head' },
    { left: 'key', right: 'open lock' },
    { left: 'phone', right: 'make calls' },
    { left: 'clock', right: 'tell time' },
    { left: 'map', right: 'show directions' },
    { left: 'bottle', right: 'hold water' },
    { left: 'pen', right: 'write words' },
    { left: 'camera', right: 'take photos' },
    { left: 'mirror', right: 'show reflection' },
    { left: 'helmet', right: 'protect head' },
    { left: 'glasses', right: 'improve vision' },
    { left: 'oven', right: 'bake food' },
    { left: 'fridge', right: 'keep food cold' },
    { left: 'bag', right: 'carry things' },
    { left: 'broom', right: 'clean floor' },
    { left: 'soap', right: 'wash hands' },
    { left: 'toothbrush', right: 'clean teeth' },
  ],
};

export const bankAnalogyHard: WordBank = {
  id: 'analogy_hard',
  relation: 'analogy',
  label: 'Harder, more abstract analogies',
  pairs: [
    { left: 'seed : tree', right: 'idea : project' },
    { left: 'foundation : building', right: 'roots : tree' },
    { left: 'training : athlete', right: 'practice : musician' },
    { left: 'question : curiosity', right: 'exercise : health' },
    { left: 'map : travel', right: 'recipe : cooking' },
    { left: 'battery : phone', right: 'fuel : car' },
    { left: 'rain : flood', right: 'sun : drought' },
    { left: 'goal : direction', right: 'compass : path' },
    { left: 'key : door', right: 'password : account' },
    { left: 'mistake : learning', right: 'failure : growth' },
    { left: 'rule : order', right: 'law : society' },
    { left: 'gravity : falling', right: 'friction : slowing' },
    { left: 'shield : protection', right: 'mask : safety' },
    { left: 'root : support', right: 'spine : body' },
    { left: 'teacher : guide', right: 'coach : mentor' },
    { left: 'sun : energy', right: 'water : life' },
    { left: 'memory : past', right: 'plan : future' },
    { left: 'habit : routine', right: 'ritual : tradition' },
    { left: 'storm : danger', right: 'medicine : healing' },
    { left: 'code : program', right: 'notes : music' },
  ],
};

const allBanks: Record<string, WordBank> = {
    [bankSynEasy.id]: bankSynEasy,
    [bankSynVerbs.id]: bankSynVerbs,
    [bankSynEmotion.id]: bankSynEmotion,
    [bankAntBasic.id]: bankAntBasic,
    [bankAntEmotion.id]: bankAntEmotion,
    [bankAntAbstract.id]: bankAntAbstract,
    [bankCategoryObjects.id]: bankCategoryObjects,
    [bankCategoryTimePlace.id]: bankCategoryTimePlace,
    [bankCategoryAbstract.id]: bankCategoryAbstract,
    [bankPlural.id]: bankPlural,
    [bankPastTense.id]: bankPastTense,
    [bankNounAdj.id]: bankNounAdj,
    [bankAnalogy.id]: bankAnalogy,
    [bankFunction.id]: bankFunction,
    [bankAnalogyHard.id]: bankAnalogyHard,
};


// --------------------------------------------------------
// LEVEL CONFIGS
// --------------------------------------------------------

export const wordSwapLevels: WordSwapLevelConfig[] = [
  // 1–3: Easy synonyms – 3 pairs per board
  { level: 1, concept: 'Easy Synonyms I', relation: 'synonym',
    hint: 'Each left word should match a word with a similar meaning.',
    bankId: 'syn_easy', itemsPerPuzzle: 3 },
  { level: 2, concept: 'Easy Synonyms II', relation: 'synonym',
    hint: 'Match each word with a word that means almost the same.',
    bankId: 'syn_easy', itemsPerPuzzle: 3 },
  { level: 3, concept: 'Easy Synonyms III', relation: 'synonym',
    hint: 'Watch for very similar meanings; some are trick answers.',
    bankId: 'syn_easy', itemsPerPuzzle: 4 },

  // 4–6: Verb synonyms
  { level: 4, concept: 'Action Synonyms I', relation: 'synonym',
    hint: 'Match each action with a similar action word.',
    bankId: 'syn_verbs', itemsPerPuzzle: 3 },
  { level: 5, concept: 'Action Synonyms II', relation: 'synonym',
    hint: 'Some actions are almost the same – choose the closest match.',
    bankId: 'syn_verbs', itemsPerPuzzle: 4 },
  { level: 6, concept: 'Action Synonyms III', relation: 'synonym',
    hint: 'Be careful: a few words look similar but are not true synonyms.',
    bankId: 'syn_verbs', itemsPerPuzzle: 4 },

  // 7–10: Emotion synonyms
  { level: 7, concept: 'Emotion Synonyms I', relation: 'synonym',
    hint: 'Match each feeling with a word that feels the same.',
    bankId: 'syn_emotion', itemsPerPuzzle: 3 },
  { level: 8, concept: 'Emotion Synonyms II', relation: 'synonym',
    hint: 'Some emotions are mild, some intense – match the closest.',
    bankId: 'syn_emotion', itemsPerPuzzle: 4 },
  { level: 9, concept: 'Emotion Synonyms III', relation: 'synonym',
    hint: 'Focus on the emotional “energy” of each word.',
    bankId: 'syn_emotion', itemsPerPuzzle: 4 },
  { level: 10, concept: 'Emotion Synonyms IV', relation: 'synonym',
    hint: 'Small differences matter now. Read each word slowly.',
    bankId: 'syn_emotion', itemsPerPuzzle: 4 },

  // 11–13: Basic antonyms
  { level: 11, concept: 'Opposites I', relation: 'antonym',
    hint: 'Match each word with its opposite meaning.',
    bankId: 'ant_basic', itemsPerPuzzle: 3 },
  { level: 12, concept: 'Opposites II', relation: 'antonym',
    hint: 'Think of the exact opposite, not just something different.',
    bankId: 'ant_basic', itemsPerPuzzle: 4 },
  { level: 13, concept: 'Opposites III', relation: 'antonym',
    hint: 'Some pairs may feel close, but only one is a true opposite.',
    bankId: 'ant_basic', itemsPerPuzzle: 4 },

  // 14–16: Emotional opposites
  { level: 14, concept: 'Emotional Opposites I', relation: 'antonym',
    hint: 'Match each personality trait with its opposite.',
    bankId: 'ant_emotion', itemsPerPuzzle: 3 },
  { level: 15, concept: 'Emotional Opposites II', relation: 'antonym',
    hint: 'Look at the social meaning of the word – kind vs cruel, etc.',
    bankId: 'ant_emotion', itemsPerPuzzle: 4 },
  { level: 16, concept: 'Emotional Opposites III', relation: 'antonym',
    hint: 'Some opposites are subtle – read carefully.',
    bankId: 'ant_emotion', itemsPerPuzzle: 4 },

  // 17–20: Abstract opposites
  { level: 17, concept: 'Abstract Opposites I', relation: 'antonym',
    hint: 'These words describe ideas, not objects. Think in concepts.',
    bankId: 'ant_abstract', itemsPerPuzzle: 3 },
  { level: 18, concept: 'Abstract Opposites II', relation: 'antonym',
    hint: 'Success vs failure, gain vs loss – think like a philosopher.',
    bankId: 'ant_abstract', itemsPerPuzzle: 4 },
  { level: 19, concept: 'Abstract Opposites III', relation: 'antonym',
    hint: 'Focus on the relationship, not just the vibe.',
    bankId: 'ant_abstract', itemsPerPuzzle: 4 },
  { level: 20, concept: 'Abstract Opposites IV', relation: 'antonym',
    hint: 'Slow down and imagine each concept in real life.',
    bankId: 'ant_abstract', itemsPerPuzzle: 4 },

  // 21–23: Objects → category
  { level: 21, concept: 'Categories I', relation: 'category',
    hint: 'Match each thing with the group it belongs to.',
    bankId: 'cat_objects', itemsPerPuzzle: 3 },
  { level: 22, concept: 'Categories II', relation: 'category',
    hint: 'Think: Is it a fruit, animal, bird, furniture…?',
    bankId: 'cat_objects', itemsPerPuzzle: 4 },
  { level: 23, concept: 'Categories III', relation: 'category',
    hint: 'Watch out for similar groups (fruit vs vegetable).',
    bankId: 'cat_objects', itemsPerPuzzle: 4 },

  // 24–26: Time & place categories
  { level: 24, concept: 'Time & Place I', relation: 'category',
    hint: 'Match each word with its time or place group.',
    bankId: 'cat_time_place', itemsPerPuzzle: 3 },
  { level: 25, concept: 'Time & Place II', relation: 'category',
    hint: 'Cities, countries, months, seasons – keep track mentally.',
    bankId: 'cat_time_place', itemsPerPuzzle: 4 },
  { level: 26, concept: 'Time & Place III', relation: 'category',
    hint: 'Now categories mix more. Think slowly.',
    bankId: 'cat_time_place', itemsPerPuzzle: 4 },

  // 27–30: Abstract categories
  { level: 27, concept: 'Roles & Ideas I', relation: 'category',
    hint: 'Match jobs, roles, feelings and systems to their type.',
    bankId: 'cat_abstract', itemsPerPuzzle: 3 },
  { level: 28, concept: 'Roles & Ideas II', relation: 'category',
    hint: 'Think: profession, emotion, sport, religion, etc.',
    bankId: 'cat_abstract', itemsPerPuzzle: 4 },
  { level: 29, concept: 'Roles & Ideas III', relation: 'category',
    hint: 'Some categories are abstract – “force”, “energy”, etc.',
    bankId: 'cat_abstract', itemsPerPuzzle: 4 },
  { level: 30, concept: 'Roles & Ideas IV', relation: 'category',
    hint: 'Replay slowly; this is more like a reasoning test now.',
    bankId: 'cat_abstract', itemsPerPuzzle: 4 },

  // 31–33: Singular → plural
  { level: 31, concept: 'Plural Forms I', relation: 'plural',
    hint: 'Match each singular noun with its plural.',
    bankId: 'plural_forms', itemsPerPuzzle: 3 },
  { level: 32, concept: 'Plural Forms II', relation: 'plural',
    hint: 'Irregular plurals (child–children, foot–feet) appear now.',
    bankId: 'plural_forms', itemsPerPuzzle: 4 },
  { level: 33, concept: 'Plural Forms III', relation: 'plural',
    hint: 'Watch for -ies, -ves, -es endings.',
    bankId: 'plural_forms', itemsPerPuzzle: 4 },

  // 34–36: Past tense
  { level: 34, concept: 'Past Tense I', relation: 'past_tense',
    hint: 'Match verbs with what they become in the past.',
    bankId: 'past_tense', itemsPerPuzzle: 3 },
  { level: 35, concept: 'Past Tense II', relation: 'past_tense',
    hint: 'Many of these are irregular. Trust your ear.',
    bankId: 'past_tense', itemsPerPuzzle: 4 },
  { level: 36, concept: 'Past Tense III', relation: 'past_tense',
    hint: 'Try saying the sentence in your head: “Yesterday I …”',
    bankId: 'past_tense', itemsPerPuzzle: 4 },

  // 37–40: Noun ↔ adjective
  { level: 37, concept: 'Noun to Adjective I', relation: 'noun_adj',
    hint: 'Match each idea with its describing word.',
    bankId: 'noun_adj', itemsPerPuzzle: 3 },
  { level: 38, concept: 'Noun to Adjective II', relation: 'noun_adj',
    hint: 'Some adjectives end with -ful, -y, or -ic. Spot the pattern.',
    bankId: 'noun_adj', itemsPerPuzzle: 4 },
  { level: 39, concept: 'Noun to Adjective III', relation: 'noun_adj',
    hint: 'Focus on meaning more than spelling.',
    bankId: 'noun_adj', itemsPerPuzzle: 4 },
  { level: 40, concept: 'Noun to Adjective IV', relation: 'noun_adj',
    hint: 'Now multiple similar-looking options appear. Choose wisely.',
    bankId: 'noun_adj', itemsPerPuzzle: 4 },

  // 41–44: Basic analogies
  { level: 41, concept: 'Analogies I', relation: 'analogy',
    hint: 'Read “A : B as C : ?” and complete the pattern.',
    bankId: 'analogy_basic', itemsPerPuzzle: 3 },
  { level: 42, concept: 'Analogies II', relation: 'analogy',
    hint: 'Match senses, roles, and simple relationships.',
    bankId: 'analogy_basic', itemsPerPuzzle: 4 },
  { level: 43, concept: 'Analogies III', relation: 'analogy',
    hint: 'Try to verbalise it: “As bird is to fly, fish is to…”.',
    bankId: 'analogy_basic', itemsPerPuzzle: 4 },
  { level: 44, concept: 'Analogies IV', relation: 'analogy',
    hint: 'This now feels close to IQ-test style questions.',
    bankId: 'analogy_basic', itemsPerPuzzle: 4 },

  // 45–47: Function / purpose
  { level: 45, concept: 'Function I', relation: 'function',
    hint: 'Match each object to what it is used for.',
    bankId: 'function', itemsPerPuzzle: 3 },
  { level: 46, concept: 'Function II', relation: 'function',
    hint: 'Some uses sound similar – choose the core purpose.',
    bankId: 'function', itemsPerPuzzle: 4 },
  { level: 47, concept: 'Function III', relation: 'function',
    hint: 'Visualise using the object. What do you actually do with it?',
    bankId: 'function', itemsPerPuzzle: 4 },

  // 48–50: Hard analogies
  { level: 48, concept: 'Hard Analogies I', relation: 'analogy',
    hint: 'Match deeper relationships like idea→project, mistake→learning.',
    bankId: 'analogy_hard', itemsPerPuzzle: 3 },
  { level: 49, concept: 'Hard Analogies II', relation: 'analogy',
    hint: 'Think about cause/effect, tool/purpose, abstract links.',
    bankId: 'analogy_hard', itemsPerPuzzle: 4 },
  { level: 50, concept: 'Hard Analogies III', relation: 'analogy',
    hint: 'This is peak difficulty. Take your time, it is meant to be hard.',
    bankId: 'analogy_hard', itemsPerPuzzle: 4 },
];

// --------------------------------------------------------
// PUBLIC API
// --------------------------------------------------------

export function getWordSwapLevelConfig(levelIndex: number): WordSwapLevelConfig {
    const clampedIndex = Math.max(0, Math.min(levelIndex, wordSwapLevels.length - 1));
    return wordSwapLevels[clampedIndex];
}

/**
 * Shuffles an array in place and returns a new array with the first N elements.
 * Uses a deterministic seed for replicable "randomness".
 */
function seededShuffleAndTake<T>(array: T[], seed: number, count: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let temporaryValue, randomIndex;
  
    // Simple pseudo-random generator from seed
    const random = () => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = shuffled[currentIndex];
      shuffled[currentIndex] = shuffled[randomIndex];
      shuffled[randomIndex] = temporaryValue;
    }
  
    return shuffled.slice(0, count);
}


export function generatePuzzle(levelIndex: number, retryCount: number): WordSwapPuzzle {
    const config = getWordSwapLevelConfig(levelIndex);
    const bank = allBanks[config.bankId];
    if (!bank) {
        throw new Error(`Word bank with id "${config.bankId}" not found.`);
    }

    // Use level + retry count to get a different set of words for each variation
    const seed = levelIndex * 20 + (retryCount % 20);
    const puzzlePairs = seededShuffleAndTake(bank.pairs, seed, config.itemsPerPuzzle);
    
    // Create the scrambled puzzle by swapping two 'right' side words
    const scrambledPairs = puzzlePairs.map(p => ({...p}));
    const indicesToSwap: [number, number] = [0, 1]; // Always swap the first two for simplicity
    
    const temp = scrambledPairs[indicesToSwap[0]].right;
    scrambledPairs[indicesToSwap[0]].right = scrambledPairs[indicesToSwap[1]].right;
    scrambledPairs[indicesToSwap[1]].right = temp;

    return {
        id: `L${levelIndex + 1}-V${retryCount % 20}`,
        pairs: scrambledPairs,
        solutionIndices: indicesToSwap,
    };
}
