import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useSearchParams } from "next/navigation";
import { useUserRoles } from "@/contexts/UserRolesContext";

type Provider =
  | 'azure'
  | 'bitbucket'
  | 'discord'
  | 'facebook'
  | 'github'
  | 'gitlab'
  | 'google'
  | 'linkedin'
  | 'slack'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'workos';

  
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { setRoles } = useUserRoles(); // <-- access context


  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  useEffect(() => {
    const fetchUser = async () => {
      
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) setRoles([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithProvider = (provider: Provider) =>
    supabase.auth.signInWithOAuth({
      provider,
        options: { 
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        }
    });

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out failed:", error.message);
    else setRoles([]);
  };

  return { user, loading, signInWithProvider, signOut };
}
