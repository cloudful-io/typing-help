"use client";
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { supabase } from "@/utils/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { UserProfile } from "supabase-auth-lib"; 
import Loading from '@/app/loading';

export default function ProfilePage() {
  const { user } = useSupabaseAuth();

  if (!user) {
    return <Loading/>;
  }

  return (
    <PageContainer title="My Profile" description="This page allows you to view / update your profile." showTitle>
      <Container sx={{ mt: 0 }}>
        <UserProfile user={user} supabase={supabase} defaultAvatarUrl="/images/icons/user.png" />
      </Container>
    </PageContainer>
  );
}