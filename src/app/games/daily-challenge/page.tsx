
"use client";

import { useMemo } from "react";
import LandmarkGame from "@/components/games/one-move-landmark/game-container";
import MathGame from "@/components/games/one-move-math/game-container";
import PatternsGame from "@/components/games/one-move-patterns/game-container";
import SymbolGame from "@/components/games/symbol-puzzle/game-container";
import { levels as landmarkLevels } from "@/lib/levels";
import { TOTAL_SYMBOL_LEVELS } from "@/lib/symbol-puzzles";
import { pickDailyChallenge, getTodaysDateKey } from "@/lib/daily-challenge";
import { mathLevels } from "@/lib/math-puzzles";
import { patternLevels } from "@/lib/pattern-puzzles";

export default function DailyChallengePage() {
  const daily = useMemo(() => {
    return pickDailyChallenge({
      dateKey: getTodaysDateKey(),
      landmarkLevelCount: landmarkLevels.length,
      mathLevelCount: mathLevels.length,
      patternsLevelCount: patternLevels.length,
      symbolLevelCount: TOTAL_SYMBOL_LEVELS,
    });
  }, []);

  const props = {
    isDailyChallenge: true,
    dailyLevel: daily.level,
    puzzleSeed: daily.puzzleSeed,
  };

  if (daily.game === "landmark") return <LandmarkGame {...props} />;
  if (daily.game === "math") return <MathGame {...props} />;
  if (daily.game === "patterns") return <PatternsGame {...props} />;
  if (daily.game === "symbol-puzzle") return <SymbolGame {...props} />;

  // Fallback or loading state
  return <div>Loading Daily Challenge...</div>;
}
