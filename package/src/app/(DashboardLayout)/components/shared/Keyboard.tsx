'use client';
import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";

const rows = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Space"]
];

const normalizeKey = (key: string): string => {
  if (key === " ") return "Space";
  if (key === "Shift" || key === "ShiftLeft" || key === "ShiftRight") return "Shift";
  if (key === "Backspace") return "Backspace";
  if (key === "Enter") return "Enter";
  if (key === "CapsLock") return "Caps";
  if (key === "Tab") return "Tab";
  return key.length === 1 ? key.toUpperCase() : key;
};

const Keyboard: React.FC = () => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(normalizeKey(e.key));
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} display="flex" justifyContent="center" gap={1}>
          {row.map((key) => {
            const isHighlighted = pressedKey === key;
            return (
              <Button
                key={key}
                variant={isHighlighted ? "contained" : "outlined"}
                color={isHighlighted ? "primary" : "inherit"}
                sx={{
                  minWidth:
                    key === "Space"
                      ? 400 // was 300
                      : ["Shift", "Backspace", "Enter", "Caps", "Tab"].includes(key)
                      ? 120 // was 100
                      : 70, // was 50
                  minHeight: 60, // optional: makes keys taller
                  fontSize: "1.2rem" // optional: makes text bigger
                                }}
                              >
                {key}
              </Button>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default Keyboard;
