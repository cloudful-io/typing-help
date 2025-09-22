'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import TypingPractice from '@/app/(DashboardLayout)/components/shared/TypingPractice';
import { Container } from "@mui/material";

const Dashboard = () => {
  return (
    <PageContainer title="Practice" description="This page allows you to practice your typing skills with various texts and track your performance.">
      <Container sx={{ mt: 0 }}>
        <TypingPractice />
      </Container>
    </PageContainer>
  );
}

export default Dashboard;
