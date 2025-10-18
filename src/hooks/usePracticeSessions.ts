import { useCallback } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { PracticeSessionService } from "@/services/practice-session-service";

export interface CharacterStats {
  char: string;
  correct: number;
  incorrect: number;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  created_at: string;
  language: string;
  wpm: number | null;
  correct_chars: number | null;
  total_chars: number | null;
  words_typed: number | null;
  duration: number | null; 
  text_id: number | null;
  character_stats: Record<string, any>;
}

export function usePracticeSessions() {
  const STORAGE_KEY = "typingAppSessions";
  const { user } = useSupabaseAuth();


  /*const getPracticeSessions = (): PracticeSession[] => {
    if (typeof window === "undefined") return []; // SSR: return empty
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  };*/
  const getPracticeSessions = useCallback(async () => {
    return await PracticeSessionService.getByUser(user?.id);
  }, [user]);

  /*const savePracticeSession = (session: PracticeSession) => {
    if (typeof window === "undefined") return; // SSR safety
    const sessions = getPracticeSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  };*/
  const savePracticeSession = useCallback(async (session: PracticeSession) => {
    return await PracticeSessionService.save(session, user?.id);
  }, [user]);

  /*const clearPracticeSessions = () => {
    console.log("start");
    if (typeof window === "undefined") return; // SSR safety
    localStorage.removeItem(STORAGE_KEY);
    console.log("end");
  }*/
  const clearPracticeSessions = useCallback(async () => {
    return await PracticeSessionService.clear(user?.id);
  }, [user]);

  return { getPracticeSessions, savePracticeSession, clearPracticeSessions };
}

export function buildCharacterStats(
  reference: string,
  typed: string
): CharacterStats[] {
  const stats: Record<string, { correct: number; incorrect: number }> = {};

  for (let i = 0; i < typed.length; i++) {
    const expected = reference[i] || "";
    const actual = typed[i];

    if (!stats[expected]) {
      stats[expected] = { correct: 0, incorrect: 0 };
    }

    if (actual === expected) {
      stats[expected].correct += 1;
    } else {
      stats[expected].incorrect += 1;
    }
  }

  return Object.entries(stats).map(([char, { correct, incorrect }]) => ({
    char,
    correct,
    incorrect,
  }));
}
