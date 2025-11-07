import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import  Stats from "@/app/(DashboardLayout)/components/shared/Stats";

export default async function StatsPage() {
  return (
    <PageContainer title="My Stats" description="This page provides the stats of your typing practice sessions, including detailed statistics and performance metrics." showTitle>
      <Container>
        <Stats/>
      </Container>
    </PageContainer>
  );
}