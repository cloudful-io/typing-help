'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import TypingPractice from '@/app/(DashboardLayout)/components/shared/TypingPractice';
import { Container } from "@mui/material";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Container sx={{ mt: 0 }}>
        <TypingPractice />
      </Container>
    </PageContainer>
  );
}

export default Dashboard;
