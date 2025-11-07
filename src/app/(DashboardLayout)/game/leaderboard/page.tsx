"use client";
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import Leaderboard from "../../components/game/Leaderboard";

export default function LeaderboardPage() {
  return (
    <PageContainer title="🏆 Global Leaderboard" description="Typing Help: Leaderboard" showTitle>
      <Container>
        <Leaderboard />
      </Container>
    </PageContainer>
  );
}