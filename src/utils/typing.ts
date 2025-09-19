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