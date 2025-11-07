"use client";
import { useEffect, useState } from "react";
import { LeaderboardService } from "@/services/leaderboard-service";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import UserAvatarName from "../shared/UserAvatarName";

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_score: number;
}

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    LeaderboardService.getLeaderboard().then(setRows);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Rank
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Player</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Total Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.user_id}
                sx={{
                  backgroundColor:
                    index === 0
                      ? "rgba(255, 215, 0, 0.1)"
                      : index === 1
                      ? "rgba(192, 192, 192, 0.1)"
                      : index === 2
                      ? "rgba(205, 127, 50, 0.1)"
                      : "inherit",
                }}
              >
                <TableCell align="center">
                  <Typography fontWeight={600}>#{index + 1}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <UserAvatarName
                      displayName={row.display_name}
                      avatarUrl={row.avatar_url || undefined}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={600}>{row.total_score}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
