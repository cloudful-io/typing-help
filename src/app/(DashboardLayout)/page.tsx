import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import HomeContent from '@/app/(DashboardLayout)/components/shared/HomeContent';
import { Container } from "@mui/material";
import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  return (
    <PageContainer title="Practice" description="This page allows you to practice your typing skills with various texts and track your performance.">
      <Container sx={{ mt: 0 }}>
        <HomeContent user={data.user!} />
      </Container>
    </PageContainer>
  );
}