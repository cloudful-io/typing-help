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
  
  async getLeaderboard(gameId?: string) {
    const query = supabase
        .from("leaderboard_results")
        .select("user_id, game_id, score, created_at")
        .order("score", { ascending: false })
        .limit(50);

    if (gameId) query.eq("game_id", gameId);

    const { data, error } = await query;
    if (error) {
        console.error(error);
        return [];
    }
    return data;
  },
};

export default LeaderboardService;

