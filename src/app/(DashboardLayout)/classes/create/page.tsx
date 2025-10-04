import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import CreateTypingClass from "@/app/(DashboardLayout)/components/classes/CreateTypingClass"

export default async function CreateClassPage() {
     
  return (
    <PageContainer title="Classes" description="This page provides teachers a way to create a class.">
      <Container sx={{ mt: 0 }}>
        <CreateTypingClass/>
      </Container>
    </PageContainer>
  );
}