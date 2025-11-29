import { supabase } from "@/utils/supabase/client";
import { wrapError, selectMaybeSingle } from "../utils/supabase/helper";
import type { Database } from "../types/database.types";

type AppStatsRow = Database["public"]["Tables"]["app_stats"]["Row"];

const APP_STATS_TABLE = "app_stats";

export const AppStatsService = {
  /**
   * Calls the atomic increment RPC.
   * This DOES NOT return the new count (stays fast).
   */
  async incrementCharacterCount(character: number): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_character_count", {
        increment_by: character, 
      });

      if (error) {
        throw wrapError("AppStatsService.incrementCharacterCount failed", error);
      }

      return;
    } catch (error) {
      throw wrapError("AppStatsService.incrementCharacterCount failed", error);
    }
  },

  /**
   * Gets the current global counters, such as calc_count.
   * Defaults to the known row ID = 1.
   */
  async getStats(): Promise<AppStatsRow | null> {
    try {
      return await selectMaybeSingle<AppStatsRow>(
        supabase
          .from(APP_STATS_TABLE)
          .select("*")
          .eq("id", 1)
      );
    } catch (error) {
      throw wrapError("CalculatorStatsService.getStats failed", error);
    }
  }
};
