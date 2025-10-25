import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useRouter } from 'next/navigation';
import { useMode } from "@/contexts/ModeContext";
  
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { setRoles } = useUserRoles(); 
  const { setMode } = useMode();

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
  }, [setRoles]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out failed:", error.message);
    else setRoles([]);
   
    setMode("practice");

    router.push('/');
  };

  return { user, loading, signOut };
}
