// app/leaderboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { LeaderboardService } from "@/services/leaderboard-service"
import { Box, Typography } from "@mui/material";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    LeaderboardService.getLeaderboard().then(setRows);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>🏆 Global Leaderboard</Typography>
      {rows.map((r, i) => (
        <Typography key={i}>
          {i + 1}. {r.user_id} — {r.score}
        </Typography>
      ))}
    </Box>
  );
}
