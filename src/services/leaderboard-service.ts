// typing-class-service.ts

import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  selectMaybeSingle,
  select,
  insertSingle,
  sleep,
} from "@/utils/supabase/helper";
//import { Database } from "@/types/database.types";
import type { GameResult } from "@/types/game";

//type PracticeTextRow = Database["public"]["Tables"]["PracticeTexts"]["Row"];

export const LeaderboardService = {
  async submitScore(userId: string, gameId: string, result: GameResult) {
    const { error } = await supabase.from("leaderboard_results").insert({
        user_id: userId,
        game_id: gameId,
        score: result.score,
        accuracy: result.accuracy,
        duration: result.duration,
    });
    if (error) console.error("Leaderboard submit error:", error);
  },
  
  async getLeaderboard() {
    const { data, error } = await supabase
    .from("leaderboard_total_score")
    .select("*")
    .limit(50);

  if (error) {
    console.error(error);
    return [];
  }
  return data;
  }
};

export default LeaderboardService;

