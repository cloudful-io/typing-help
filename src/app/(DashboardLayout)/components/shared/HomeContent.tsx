"use client";

import { useEffect, useState } from "react"; 
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import ClassroomMode from "@/app/(DashboardLayout)/components/class/ClassroomMode"
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { UserService } from 'supabase-auth-lib';
import Loading from "@/app/loading";
import Marketing from "./Marketing";

interface HomeContentProps {
  user: User;
}

export default function HomeContent({ user }: HomeContentProps) {

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        // Create or update user in DB
        const userService = new UserService(supabase);
        
        const userObject = await userService.getOrCreateOrUpdate({
          id: user.id,
          email: user.email!,
        });
        // Redirect if not onboarded
        if (!userObject.onboarding_complete) {
          router.replace('/new');
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user !== null) {
      checkOnboarding();
    }
    else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return <Loading/>;
  }
  if (user) {
    return <ClassroomMode/>;
  }
  return (
    <Marketing/>
  );
}
