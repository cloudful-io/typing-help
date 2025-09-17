import { createClient } from '@/utils/supabase/server';

export async function getRandomPublicPracticeText(language: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_random_public_practice_text",
    { lang: language }
  );

  if (error) {
    console.error("Supabase RPC Error:", error.message);
    throw error;
  }

  return data?.[0] || null;
}
