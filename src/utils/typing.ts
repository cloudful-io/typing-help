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

    if (progress > 0.25) return "info.main";
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

const AVG_WPM = 80;     // English: conservative baseline words/min
const AVG_CPM = 60;     // Chinese: conservative baseline Han chars/min

export function expandPracticeText(
  content: string,
  durationSeconds: number,
  language: string
): string {
  // Calculate target character budget based on language
  const charsPerMinute = isLanguageCharacterBased(language)
    ? AVG_CPM                  // Chinese: CPM maps directly to chars
    : AVG_WPM * 5;             // English: words × avg chars/word

  const targetChars = Math.round((durationSeconds / 60) * charsPerMinute);

  const lines = content
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0 || content.length >= targetChars) return content;

  const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

  const result: string[] = [...lines];
  while (result.join("\n").length < targetChars) {
    result.push(...shuffle(lines));
  }

  const joined = result.join(" ");
  if (joined.length <= targetChars) return joined;

  const cut = joined.lastIndexOf("\n", targetChars);
  return joined.slice(0, cut > 0 ? cut : targetChars);
}