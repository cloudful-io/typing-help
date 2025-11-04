import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import HomeContent from '@/app/(DashboardLayout)/components/shared/HomeContent';
import { Container } from "@mui/material";
import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  return (
    <PageContainer title="Typing Help" description="Typing Help is a learning platform to help people of all ages to improve their typing skills, through practices, games, and managed virtual learning.">
      <Container sx={{ mt: 0 }}>
        <HomeContent user={data.user!} />
      </Container>
    </PageContainer>
  );
}