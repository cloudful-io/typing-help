import React, { useState } from "react";
import { Box, FormControlLabel, Switch } from "@mui/material";
import Key from "./Key";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  activeKey?: string | null;
  shiftActive?: boolean; 
}

const keyboardLayout: string[][] = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["ShiftLeft", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "ShiftRight"],
  ["Space"],
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, activeKey, shiftActive }) => {
  const [showKeyboard, setShowKeyboard] = useState(true);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "fit-content"  }}>
      {/* Switch to toggle keyboard */}
      <FormControlLabel
        control={
          <Switch
            checked={showKeyboard}
            onChange={(e) => setShowKeyboard(e.target.checked)}
          />
        }
        label={showKeyboard ? "Show Keyboard" : "Show Keyboard"}
        sx={{ alignSelf: "flex-start", mb: 1 }}
      />

      {/* Conditionally render keyboard */}
      {showKeyboard && (
        <>
          {keyboardLayout.map((row, rowIndex) => (
            <Box key={rowIndex} sx={{ display: "flex",  width: "75%", justifyContent: "center", maxWidth: "90vw", mx: "auto", gap: 1 }}>
              {row.map((key, keyIndex) => {
                const displayKey = key.replace("Left", "").replace("Right", "");
                let width: string | number = "3vw";

                const isActive =
                  activeKey === displayKey.toUpperCase() || 
                  (shiftActive && displayKey === "Shift") || 
                  (["Caps", "Enter", "Backspace", "Space"].includes(displayKey) && activeKey === displayKey);

                if (key === "Space") width = "8vw";
                if (["ShiftLeft", "ShiftRight", "Backspace", "Enter", "Caps", "Tab"].includes(key)) {
                  width = "8vw";
                }

                return (
                  <Key
                    key={`${key}-${rowIndex}-${keyIndex}`}
                    label={displayKey}
                    onPress={onKeyPress}
                    width={width}
                    active={isActive}
                  />
                );
              })}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default Keyboard;