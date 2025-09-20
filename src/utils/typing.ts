//import { useTheme } from "@mui/material/styles";

export function getAccuracyColor(accuracy: number | null, total: number): string {
  if (accuracy === null || total === 0) return "#bdbdbd"; // gray
  if (accuracy < 85) return "#f44336";  // red
  if (accuracy < 95) return "#ff9800";  // orange
  return "#4caf50";                     // green
}

export function calculateAccuracy(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

export function getWPMColor(wpm: number | null, targetWPM: number): string {
    
    if (wpm === null) return "#bdbdbd"; // gray
    if (wpm < targetWPM * 0.6) return "#f44336"; // red if <60% of target
    if (wpm < targetWPM * 0.8) return "#ff9800"; // orange if 60-80%
    return "#4caf50"; // green if >80%
}

export function isLanguageCharacterBased(language: string): boolean {
    return ["zh-Hant", "zh-Hans", "ja", "ko"].includes(language);
}

export function getTimerControlColor(remainingTime: number, totalTime: number): string {
    
    const progress = remainingTime / totalTime;

    if (progress > 0.25) return "success.main";
    else if (progress > 0.1) return "warning.main";
    else return "error.main";
}

export const computeTypingResults = (
  typedText: string,
  targetText: string,
  language: string,
  elapsedSeconds: number
) => {
  const correct = typedText
    .split("")
    .reduce((acc, char, idx) => (char === targetText[idx] ? acc + 1 : acc), 0);
  const total = typedText.length;

  const elapsedMinutes = elapsedSeconds / 60;

  const wordsTyped = countWords(typedText, language);
  const wpm = Math.round(wordsTyped/elapsedMinutes);

  return { correct, total, wpm };
};

export const countWords = (typedText: string, language: string): number => {
  if (!typedText.trim()) return 0;

  if (isLanguageCharacterBased(language)) {
    return (typedText.match(/\p{Script=Han}/gu) || []).length;
  }
  return typedText.trim().split(/\s+/).length;
};
