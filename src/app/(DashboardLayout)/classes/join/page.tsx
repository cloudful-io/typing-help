import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import JoinTypingClass from "@/app/(DashboardLayout)/components/classes/JoinTypingClass"

export default async function CreateClassPage() {
  
  return (
    <PageContainer title="Classes" description="This page provides students a way to join a class.">
      <Container sx={{ mt: 0 }}>
        <JoinTypingClass/>
      </Container>
    </PageContainer>
  );
}