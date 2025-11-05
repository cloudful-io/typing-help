"use client";

import { useEffect } from "react";
import ClassList from "../class/ClassList";
import { useMode } from '@/contexts/ModeContext';

export default function ClassroomMode() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("class");
  }, [setMode]);

  return <ClassList/>;
}
