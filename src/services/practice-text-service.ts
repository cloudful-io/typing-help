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
        .order("assigned_at", { ascending: false })
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
    label,
    randomize_text,
    assigned_at,
  }: {
    owner_teacher_id: string | null;
    class_id: number | null;
    content: string;
    language: string;
    duration_seconds: number;
    label: string | null;
    randomize_text: boolean;
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
            label: label?.trim() ? label.trim() : null,
            is_public: false,
            randomize_text,
            assigned_at,
          }]
        );

      return newText;
    } catch (error) {
      console.error("Failed to add practice text:", error);
      throw wrapError("addPracticeText failed", error);
    }
  },
  async updatePracticeText(
    id: number,
    updates: {
      content?: string;
      language?: string;
      duration_seconds?: number;
      label?: string | null;
      randomize_text?: boolean;
      assigned_at?: string;
    }
  ) {
    try {
      console.log("Updating practice text with ID:", id, "Updates:", updates);
      const { data, error } = await supabase
        .from("PracticeTexts")
        .update({
          ...updates,
          label: updates.label?.trim() ? updates.label.trim() : null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PracticeTextRow;
    } catch (error) {
      console.error("Failed to update practice text:", error);
      throw wrapError("updatePracticeText failed", error);
    }
  },
  async deletePracticeText(id: number) {
    try {
      const { data, error } = await supabase
        .from("PracticeTexts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to delete practice text:", error);
      throw wrapError("deletePracticeText failed", error);
    }
  },
};

export default PracticeTextService;

