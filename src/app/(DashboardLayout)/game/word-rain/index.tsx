// app/games/word-rain/index.ts
import  {WordRain}  from "./WordRain";
import type { GameResult, GameDefinition } from "@/types/game";

export const wordRainGame: GameDefinition = {
  id: "word-rain",
  name: "Word Rain",
  description: "Type falling words before they hit the ground!",
  run: (onFinish: (result: GameResult) => void): React.JSX.Element => (<WordRain onFinish={onFinish} />)
};
