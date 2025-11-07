"use client";
import { useEffect } from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
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
      <PageContainer title="Game Mode" description="Typing Help: Game Mode">
        <Container sx={{ mt: 0 }}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={3}>🎮 Typing Game Hub</Typography>
            {games.map((g) => (
              <Box key={g.id} mb={2}>
                <Typography variant="h6">{g.name}</Typography>
                <Typography variant="body2">{g.description}</Typography>
                <Link href={`/game/${g.id}`}>
                  <Button variant="contained" sx={{ mt: 1 }}>Play</Button>
                </Link>
              </Box>
            ))}
          </Box>
        </Container>
      </PageContainer>
    </>
  );
}
