import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import CreateJoinTypingClass from "@/app/(DashboardLayout)/components/classes/CreateJoinTypingClass"
import TypingClassList from '@/app/(DashboardLayout)/components/classes/TypingClassList';
export default async function ClassPage() {
     
  return (
    <PageContainer title="Classes" description="This page provides teachers and students a way to create or join a class.">
      <Container sx={{ mt: 0 }}>
        <CreateJoinTypingClass/>
      </Container>
    </PageContainer>
  );
}