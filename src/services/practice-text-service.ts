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

type PracticeTextRow = Database["public"]["Tables"]["PracticeTexts"]["Row"];

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
  async getPracticeTextByClass(class_id: number) {
    try {
      return await select<PracticeTextRow>(
        supabase
        .from("PracticeTexts")
        .select("*")
        .eq("class_id", class_id)
      );
    } catch (err) {
      console.error("getPracticeTextByClass failed:", err);
      return [];
    }
  },
};

export default PracticeTextService;

