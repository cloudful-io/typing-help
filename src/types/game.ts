import React from "react";

export interface GameResult {
  score: number;
  accuracy?: number;
  wpm?: number;
  duration?: number;
  timestamp?: number;
}

export interface GameDefinition {
  id: string;
  name: string;
  description: string;
  run: (onFinish: (result: GameResult) => void) => React.JSX.Element;
}