
type LandmarkCategory = 'architecture' | 'nature' | 'sky' | 'city' | 'interior' | 'abstract' | 'all';

interface LevelConfig {
    grid: number;
    categories: LandmarkCategory[];
    timer?: boolean;
}

/**
 * Defines the difficulty curve of the game.
 * Maps a player's level to a specific grid size and allowed image categories.
 * @param level The player's current level number (0-indexed).
 * @returns {LevelConfig} The configuration for that level.
 */
export function getLevelConfig(level: number): LevelConfig {
    if (level < 5) return { grid: 3, categories: ['all'] }; // Levels 1-5
    if (level < 15) return { grid: 4, categories: ['architecture', 'city', 'nature'] }; // Levels 6-15
    if (level < 30) return { grid: 5, categories: ['architecture', 'interior', 'high'] }; // Levels 16-30
    if (level < 50) return { grid: 6, categories: ['architecture', 'high'] }; // Levels 31-50
    // For levels 51+, introduce a timer as an added challenge
    return { grid: 6, categories: ['architecture'], timer: true }; // Levels 51+
}

/**
 * Placeholder for Phase 2: Image Difficulty Scoring.
 * This function will eventually analyze an image and return a difficulty score.
 * For now, it returns a default value.
 * @param imageUrl The URL of the image to analyze.
 * @returns {number} A difficulty score (e.g., 0.0 to 1.0).
 */
export function calculateDifficultyScore(imageUrl: string): number {
    // In the future, this could involve client-side analysis of the image
    // to calculate contrast, texture complexity, etc.
    // For now, we return a neutral score.
    console.log(`Scoring image (not implemented): ${imageUrl}`);
    return 0.5;
}
