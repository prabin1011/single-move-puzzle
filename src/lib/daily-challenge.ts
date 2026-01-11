

// src/lib/daily-challenge.ts

export type DailyGame = "landmark" | "math" | "patterns" | "symbol-puzzle" | "word-swap";

// Choose ONE. If you want the same puzzle globally, use UTC.
// If you want it to follow a specific timezone, set it here.
const DAILY_TIMEZONE = "UTC" as const;

export function getTodaysDateKey(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DAILY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find(p => p.type === "year")?.value ?? "0000";
  const m = parts.find(p => p.type === "month")?.value ?? "00";
  const d = parts.find(p => p.type === "day")?.value ?? "00";
  return `${y}-${m}-${d}`; // deterministic day key
}

// Small deterministic hash (FNV-1a 32-bit)
function hash32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Deterministic pseudo-random from a uint32 seed
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickDailyChallenge(args: {
  dateKey?: string;                 // for testing
  landmarkLevelCount: number;       // levels.length
  mathLevelCount: number;           // 50
  patternsLevelCount: number;       // 50
  symbolLevelCount: number;         // TOTAL_SYMBOL_LEVELS
  wordSwapLevelCount: number;       // 100
}) {
  const dateKey = args.dateKey ?? getTodaysDateKey();
  const seedBase = hash32(`daily:${dateKey}`);

  const availableGames: DailyGame[] = [
    ...(args.landmarkLevelCount > 0 ? ["landmark" as const] : []),
    ...(args.mathLevelCount > 0 ? ["math" as const] : []),
    ...(args.patternsLevelCount > 0 ? ["patterns" as const] : []),
    ...(args.symbolLevelCount > 0 ? ["symbol-puzzle" as const] : []),
    ...(args.wordSwapLevelCount > 0 ? ["word-swap" as const] : []),
  ];

  if (availableGames.length === 0) {
      // Fallback or throw error if no games have levels
      console.error("No daily games available with any levels.");
      // Fallback to landmark just in case, though this state should be avoided.
      return { dateKey, game: "landmark" as DailyGame, level: 0, puzzleSeed: `daily:${dateKey}:landmark:L0` };
  }

  const rngGame = mulberry32(seedBase);
  const game = availableGames[Math.floor(rngGame() * availableGames.length)];

  const maxByGame: Record<DailyGame, number> = {
    landmark: Math.max(1, args.landmarkLevelCount),
    math: Math.max(1, args.mathLevelCount),
    patterns: Math.max(1, args.patternsLevelCount),
    "symbol-puzzle": Math.max(1, args.symbolLevelCount),
    "word-swap": Math.max(1, args.wordSwapLevelCount),
  };

  const max = maxByGame[game];

  // Pick from 40–50 range, or highest available if fewer.
  // Levels are 0-indexed in your containers.
  const start = 39; // = level 40 (human)
  const end = 49;   // = level 50 (human)

  const clampedStart = Math.min(start, max - 1);
  const clampedEnd = Math.min(end, max - 1);

  // deterministic pick inside [clampedStart..clampedEnd]
  const span = Math.max(1, clampedEnd - clampedStart + 1);

  const rngLevel = mulberry32(hash32(`daily:${dateKey}:${game}`));
  const level = clampedStart + Math.floor(rngLevel() * span);

  // A stable seed string (used by game containers to derive numeric seed)
  const puzzleSeed = `daily:${dateKey}:${game}:L${level}`;

  return { dateKey, game, level, puzzleSeed };
}



    