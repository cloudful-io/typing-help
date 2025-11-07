"use client";
import { useEffect } from 'react';
import { useMode } from '@/contexts/ModeContext';
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import { games } from './GameRegistry';

export default function GameMode() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("game");
  }, [setMode]);

  return (
    <>
      {games.map((g) => (
        <Box key={g.id} mb={2}>
          <Typography variant="h4" sx={{mb:1}}>{g.name}</Typography>
          <Typography variant="body1">{g.description}</Typography>
          <Link href={`/game/${g.id}`}>
            <Button variant="contained" sx={{ mt: 1 }}>Play</Button>
          </Link>
        </Box>
      ))}
    </>
  );
}
