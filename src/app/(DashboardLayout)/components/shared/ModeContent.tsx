"use client";

import { useMode } from "@/contexts/ModeContext";
import { useEffect, useState } from "react"; 
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import Practice from "../class/Practice";
import ClassroomMode from "./ClassroomMode";
import GameMode from "./GameMode";
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { UserService } from 'supabase-auth-lib';
import Loading from "@/app/loading";

interface ModeContentProps {
  user: User;
}

export default function ModeContent({ user }: ModeContentProps) {

  const searchParams = useSearchParams();
  const { mode, setMode } = useMode();
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

  useEffect(() => {
    const m = searchParams.get("m"); 
    if (user === null) {
      setMode("practice");
      return;
    }
    if (m) {
      const mode = m.toLowerCase();
      if (mode === "practice" || mode === "classroom" || mode === "game") {
        setMode(mode);
      }
    } 
  }, [searchParams, user, setMode]);

  if (loading) {
    return <Loading/>;
  }
  return (
    <>
      {mode === "practice" && 
        <Practice/>
      }
      {mode === "classroom" && 
        <ClassroomMode/>
      }
      {mode === "game" && 
       <GameMode/>
      }
    </>
  );
}
