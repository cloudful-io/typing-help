import { createClient } from '@/utils/supabase/server';
import { UUID } from 'crypto';

type UserInput = {
  id: string;
  email: string;
  fullName: string;
  onboardingComplete?: boolean;
};


export async function getUser(email: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Supabase Error (getUser):', error.message);
  }
  
  return data;
}

export async function getOrCreateOrUpdateUser(user: UserInput) {
  const supabase = await createClient();

  // Build the payload conditionally
  const payload: any = {
    id: user.id,
    email: user.email,
    full_name: user.fullName,
  };

  if (user.onboardingComplete !== undefined) {
    payload.onboarding_complete = user.onboardingComplete;
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: "email" })
    .select()
    .single();

  if (error) {
    console.error('Supabase Upsert Error (getOrCreateOrUpdateUser):', error.message);
    throw error;
  }

  return data;
}
