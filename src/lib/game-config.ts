
type LandmarkCategory = 'architecture' | 'nature' | 'sky' | 'city' | 'interior' | 'abstract' | 'all';

interface LevelConfig {
    grid: number;
}

/**
 * Defines the difficulty curve of the game.
 * Maps a player's level to a specific grid size.
 * @param levelIndex The player's current level number (0-indexed).
 * @returns {LevelConfig} The configuration for that level.
 */
export function getLevelConfig(levelIndex: number): LevelConfig {
    if (levelIndex >= 10) return { grid: 6 }; // Level 11+
    if (levelIndex >= 4) return { grid: 5 };  // Level 5-10
    if (levelIndex >= 1) return { grid: 4 };  // Level 2-4
    return { grid: 3 }; // Level 1
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
