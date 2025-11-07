"use client";

import { useState } from "react";
import { LeaderboardService } from "@/services/leaderboard-service";
import type { GameDefinition, GameResult } from "@/types/game";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export function GameRunner({
  game,
  userId,
}: {
  game: GameDefinition;
  userId: string;
}) {
  const [finished, setFinished] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const { user } = useSupabaseAuth();

  const handleFinish = async (result: GameResult) => {
    console.log("in handle finish")
    setFinished(true);
    setLastResult(result);
    await LeaderboardService.submitScore(user!.id, game.id, result);
  };

  if (finished && lastResult)
    return (
      <div>
        <h3>Game Over!</h3>
        <p>Score: {lastResult.score}</p>
      </div>
    );

  return game.run(handleFinish);
}
