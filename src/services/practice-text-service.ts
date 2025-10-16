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
  async getPracticeTextById(id: number) {
    try {
      return await selectMaybeSingle<PracticeTextRow>(
        supabase
        .from("PracticeTexts")
        .select("*")
        .eq("id", id)
      );
    } catch (err) {
      console.error("getPracticeTextByClass failed:", err);
      return null;
    }
  },
  async getPracticeTextByClass(class_id: number) {
    try {
      return await select<PracticeTextRow>(
        supabase
        .from("PracticeTexts")
        .select("*")
        .eq("class_id", class_id)
        .order("assigned_at")
      );
    } catch (err) {
      console.error("getPracticeTextByClass failed:", err);
      return [];
    }
  },
  async addPracticeText({
    owner_teacher_id,
    class_id,
    content,
    language,
    duration_seconds,
    assigned_at,
  }: {
    owner_teacher_id: string | null;
    class_id: number | null;
    content: string;
    language: string;
    duration_seconds: number;
    assigned_at: string;
  }) {
    try {
      const newText = await insertSingle<PracticeTextRow>(
        supabase
          .from("PracticeTexts"),
          [{
            owner_teacher_id,
            class_id,
            content,
            language,
            duration_seconds,
            is_public: false,
            assigned_at,
          }]
        );

      return newText;
    } catch (error) {
      console.error("Failed to add practice text:", error);
      throw wrapError("addPracticeText failed", error);
    }
  },
};

export default PracticeTextService;

