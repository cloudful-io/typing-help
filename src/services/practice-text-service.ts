// typing-class-service.ts

import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  selectMaybeSingle,
  select,
  insertSingle,
  sleep,
} from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type PracticeTextRow = Database["public"]["Tables"]["Practice_Text"]["Row"];

export const PracticeTextService = {
  async getPublicPracticeText(language: string) {
    const { data, error } =  await supabase.rpc(
      "get_random_public_practice_text",
      { lang: language }
    );
    
    if (error) {
      console.error("Supabase RPC Error:", error.message);
      throw error;
    }

    return data?.[0] || null;
  },
};

export default PracticeTextService;

