import  {WordRain}  from "./WordRain";
import type { GameResult, GameDefinition } from "@/types/game";

export const wordRainGame: GameDefinition = {
  id: "word-rain",
  name: "Word Rain",
  description: "Type the falling words before they hit the ground! Test your speed, accuracy, and focus in this fast-paced typing challenge as the storm intensifies with every second.",
  run: (onFinish: (result: GameResult) => void): React.JSX.Element => (<WordRain onFinish={onFinish} />)
};
