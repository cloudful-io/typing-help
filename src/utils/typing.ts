export function getAccuracyColor(accuracy: number | null, total: number): string {
  if (accuracy === null || total === 0) return "#bdbdbd"; // gray
  if (accuracy < 85) return "#f44336";  // red
  if (accuracy < 95) return "#ff9800";  // orange
  return "#4caf50";                     // green
}

export function calculateAccuracy(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}