"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Mode = "practice" | "class" | "game";

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<Mode>("practice");

  // Load saved mode from localStorage on mount
  useEffect(() => {
    const storedMode = localStorage.getItem("mode") as Mode | null;
    if (storedMode) setModeState(storedMode);
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("mode", newMode); // persist in localStorage
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useMode must be used within a ModeProvider");
  return context;
};
