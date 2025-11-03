import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import Practice from '../components/class/Practice';

export default async function PracticePage() {
  return (
    <PageContainer title="Practice" description="This page allows you to practice your typing skills with various texts and track your performance.">
      <Container sx={{ mt: 0 }}>
        <Practice/>
      </Container>
    </PageContainer>
  );
}