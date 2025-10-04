'use client';
import React, { createContext, useContext, useState } from 'react';

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

interface ClassContextType {
  activeClass: TypingClass | null;
  setActiveClass: (cls: TypingClass | null) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeClass, setActiveClass] = useState<TypingClass | null>(null);
  return (
    <ClassContext.Provider value={{ activeClass, setActiveClass }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => {
  const ctx = useContext(ClassContext);
  if (!ctx) throw new Error("useClassContext must be used inside ClassProvider");
  return ctx;
};
