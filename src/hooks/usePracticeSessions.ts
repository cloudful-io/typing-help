import { useCallback } from "react";

export interface CharacterStats {
  char: string;
  correct: number;
  incorrect: number;
}

export interface PracticeSession {
  id: string;
  date: string;
  language: string;
  wpm: number;
  correctChars: number;
  totalChars: number
  duration: number; // seconds
  textId?: string;
  characterStats: CharacterStats[];
}

export function usePracticeSessions() {
  const STORAGE_KEY = "typingAppSessions";

  const getSessions = useCallback((): PracticeSession[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }, []);

  const saveSession = useCallback((session: PracticeSession) => {
    const sessions = getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [getSessions]);

  return { getSessions, saveSession };
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
