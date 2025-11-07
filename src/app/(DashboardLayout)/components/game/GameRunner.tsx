"use client";

import { useState } from "react";
import { LeaderboardService } from "@/services/leaderboard-service";
import type { GameDefinition, GameResult } from "@/types/game";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button, Box, Typography } from "@mui/material";

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
    setFinished(true);
    setLastResult(result);
    await LeaderboardService.submitScore(user!.id, game.id, result);
  };

  const handlePlayAgain = () => {
    setFinished(false);
    setLastResult(null);
  };

  if (finished && lastResult)
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5" gutterBottom>
          🎮 Game Over!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Score: <strong>{lastResult.score}</strong>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlayAgain}
          sx={{ mt: 2 }}
        >
          Play Again
        </Button>
      </Box>
    );

  return game.run(handleFinish);
}
