"use client";

import { useMode } from "@/contexts/ModeContext";
import PracticeMode from "./PracticeMode";
import ClassroomMode from "./ClassroomMode";
import GameMode from "./GameMode";

export default function ModeContent() {
  const { mode } = useMode();

  return (
    <>
      {mode === "practice" && 
        <PracticeMode/>
      }
      {mode === "classroom" && 
        <ClassroomMode/>
      }
      {mode === "game" && 
       <GameMode/>
      }
    </>
  );
}
