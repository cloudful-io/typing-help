"use client";
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { supabase } from "@/utils/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { UserProfile } from "supabase-auth-lib"; 
import { Box, Typography } from "@mui/material";
import Loading from '@/app/loading';

export default function ProfilePage() {
  const { user } = useSupabaseAuth();

  if (!user) {
    return <Loading/>;
  }

  return (
    <PageContainer title="My Profile" description="This page allows you to view / update your profile.">
      <Container sx={{ mt: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
          <Typography variant="h3">My Profile</Typography>
          <UserProfile user={user} supabase={supabase} defaultAvatarUrl="/images/icons/user.png" />
        </Box>
      </Container>
    </PageContainer>
  );
}