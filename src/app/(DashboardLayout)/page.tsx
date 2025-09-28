//'use client'

import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import TypingPractice from '@/app/(DashboardLayout)/components/shared/TypingPractice';
import { Container } from "@mui/material";
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";
import { getOrCreateOrUpdateUser } from '@/lib/user';

export default async function Dashboard() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
    
  if (!error && data?.user) 
  {
    const userObject = await getOrCreateOrUpdateUser({id: data?.user.id, email: data?.user.email!, fullName: data?.user.user_metadata?.full_name});
    
    if (userObject && !userObject.onboarding_complete) {
      redirect("/new"); 
    }
    else if (!userObject) {
      redirect("/new?nouserobject");
    }
    else if (userObject.onboarding_complete) {
      redirect("/new?onboardingcomplete")
    }
  }
  else if (error) {
    redirect(`/new?${error}`)
  }
  else if (!data?.user) {
    redirect("/new?nouser")
  }

  return (
    <PageContainer title="Practice" description="This page allows you to practice your typing skills with various texts and track your performance.">
      <Container sx={{ mt: 0 }}>
        <TypingPractice />
      </Container>
    </PageContainer>
  );
}