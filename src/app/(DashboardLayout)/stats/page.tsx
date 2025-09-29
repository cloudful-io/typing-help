import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import  Stats from "@/app/(DashboardLayout)/components/shared/Stats";

export default async function StatsPage() {
  return (
    <PageContainer title="Stats" description="This page provides the stats of your typing practice sessions, including detailed statistics and performance metrics.">
      <Container sx={{ mt: 0 }}>
        <Stats/>
      </Container>
    </PageContainer>
  );
}