import { supabase } from "@/utils/supabase/client";
import { select, insertSingle } from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type PracticeSessionRow = Database["public"]["Tables"]["practice_sessions"]["Row"];

const STORAGE_KEY = "typingAppSessions";

export const PracticeSessionService = {
    
  async save(session: PracticeSessionRow, userId?: string) {
    console.log("in save");
    console.log(userId);
    if (userId) {
      // Authenticated → save to Supabase
      return await insertSingle<PracticeSessionRow>(
        supabase.from("practice_sessions"),
        [{ ...session, user_id: userId }]
      );
    } else {
      // Unauthenticated → save to localStorage
      const sessions = JSON.parse(localStorage.getItem("typingAppSessions") || "[]");
      sessions.push(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return session;
    }
  },

  async getByUser(userId?: string): Promise<PracticeSessionRow[]> {
    if (userId) {
        return await select<PracticeSessionRow>(
        supabase
            .from("practice_sessions")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true })
        );
    } else {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }
  },

  async getByPracticeText(textId?: string): Promise<PracticeSessionRow[]> {
    if (!textId) return [];

    const { data, error } = await supabase
      .from("practice_sessions")
      .select(`
        *,
        user_profiles(display_name)
      `)
      .eq("text_id", textId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching practice sessions:", error);
      return [];
    }

    // Flatten display_name for convenience
    return data.map((row: any) => ({
      ...row,
      display_name: row.user_profiles?.display_name || row.user_id
    }));
  },


  async getByUserAndPracticeText(userId?: string, textId?: string): Promise<PracticeSessionRow[]> {
    if (!userId || !textId) return [];

    return await select<PracticeSessionRow>(
        supabase
            .from("practice_sessions")
            .select("*")
            .eq("user_id", userId)
            .eq("text_id", textId)
            .order("created_at", { ascending: true })
        );
  },

  async clear(userId?: string) {
    if (userId) {
      const { error } = await supabase.from("practice_sessions").delete().eq("user_id", userId);
      if (error) throw error;

    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
