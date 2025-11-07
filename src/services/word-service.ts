import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  selectMaybeSingle,
  select,
  insertSingle,
  sleep,
} from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type WordBankRow = Database["public"]["Tables"]["word_bank"]["Row"];

export const WordBankService = {
  async getWords(language: string, limit = 50): Promise<string[]> {

    const rows = await select<WordBankRow>(
        supabase
        .from("word_bank")
        .select("word")
        .eq("language", language)
        .limit(limit));

      // map to array of strings
      return rows.map(row => row.word);
  },
};
