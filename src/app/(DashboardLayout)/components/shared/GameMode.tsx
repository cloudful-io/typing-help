"use client";
import { useEffect } from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { useMode } from '@/contexts/ModeContext';

export default function GameMode() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("game");
  }, [setMode]);

  return (
    <>
      <PageContainer title="Game Mode" description="Typing Help: Game Mode">
        <Container sx={{ mt: 0 }}>
          Available Soon!
        </Container>
      </PageContainer>
    </>
  );
}
