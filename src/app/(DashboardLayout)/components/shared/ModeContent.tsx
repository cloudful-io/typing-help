"use client";

import { useMode } from "@/contexts/ModeContext";
import { useEffect } from "react"; 
import { useSearchParams } from "next/navigation";
import PracticeMode from "./PracticeMode";
import ClassroomMode from "./ClassroomMode";
import GameMode from "./GameMode";

export default function ModeContent() {
  const searchParams = useSearchParams();
  const { mode, setMode } = useMode();

  useEffect(() => {
    const m = searchParams.get("m"); 
    if (m) {
      const mode = m.toLowerCase();
      if (mode === "practice" || mode === "classroom" || mode === "game") {
        setMode(mode);
      }
    } 
  }, [searchParams, setMode]);

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
