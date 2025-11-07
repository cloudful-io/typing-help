"use client";
import { useEffect } from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { useMode } from '@/contexts/ModeContext';
import Link from "next/link";
import { Box, Typography, Button, Divider } from "@mui/material";
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
            <Typography variant="h2" sx={{mb:2}}>Game Hub</Typography>
            <Divider sx={{ my: 2 }} />
            {games.map((g) => (
              <Box key={g.id} mb={2}>
                <Typography variant="h4" sx={{mb:1}}>{g.name}</Typography>
                <Typography variant="body2">{g.description}</Typography>
                <Link href={`/game/${g.id}`}>
                  <Button variant="contained" sx={{ mt: 1 }}>Play</Button>
                </Link>
              </Box>
            ))}
        </Container>
      </PageContainer>
    </>
  );
}
