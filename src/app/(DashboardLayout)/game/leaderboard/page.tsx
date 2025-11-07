"use client";
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import Leaderboard from "../../components/game/Leaderboard";
import { Typography, Divider } from "@mui/material";

export default function LeaderboardPage() {
  return (
    <PageContainer title="Leaderboard" description="Typing Help: Leaderboard">
      <Container sx={{ mt: 0 }}>
        <Typography variant="h2" sx={{mb:2}}>🏆 Global Leaderboard</Typography>
        <Divider sx={{ my: 2 }} />
        <Leaderboard />
      </Container>
    </PageContainer>
  );
}