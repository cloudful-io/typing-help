import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import ClassroomMode from "@/app/(DashboardLayout)/components/class/ClassroomMode"
export default async function ClassPage() {
     
  return (
    <PageContainer title="Classes" description="This page provides teachers and students a way to create or join a class.">
      <Container sx={{ mt: 0 }}>
        <ClassroomMode/>
      </Container>
    </PageContainer>
  );
}