'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import { Container } from "@mui/material";
import  History from "@/app/(DashboardLayout)/components/shared/History";

const HistoryPage = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Container sx={{ mt: 0 }}>
        <History/>
      </Container>
    </PageContainer>
  );
}

export default HistoryPage;
