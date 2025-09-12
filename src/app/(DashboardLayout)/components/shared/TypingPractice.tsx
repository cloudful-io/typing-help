import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import Keyboard from "./Keyboard";

// Sample sentences
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Hello World! Practice makes perfect.",
  "Typing is fun and improves speed.",
  "React is a powerful library for building UIs.",
  "Consistency and practice lead to mastery."
];

const TypingPractice: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [targetText, setTargetText] = useState(sampleTexts[0]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [shiftActive, setShiftActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Start a new sentence
  const newSentence = () => {
    const randIndex = Math.floor(Math.random() * sampleTexts.length);
    setTargetText(sampleTexts[randIndex]);
    setTypedText("");
    setStartTime(null);
    setWPM(0);
    setAccuracy(100);
    setActiveKey(null);
    setShiftActive(false);
  };

  const handleKeyPress = (key: string) => {
    if (!startTime) setStartTime(Date.now());

    if (key === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
    } else if (key === "Space") {
      setTypedText((prev) => prev + " ");
    } else if (key === "Enter") {
      setTypedText((prev) => prev + "\n");
    } else if (["Shift", "Ctrl", "Meta", "Alt", "Caps", "Tab", "Menu"].includes(key)) {
      // ignore modifier keys
    } else {
      setTypedText((prev) => prev + key);
    }
  };

  // Handle physical key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let pressedKey = e.key;

      // Normalize special keys
      switch (pressedKey) {
        case " ": pressedKey = "Space"; break;
        case "CapsLock": pressedKey = "Caps"; break;
        case "Shift": pressedKey = "Shift"; setShiftActive(true); break;
        case "Meta": pressedKey = "Meta"; break;
        case "Enter": pressedKey = "Enter"; break;
        case "Tab": pressedKey = "Tab"; break;
        case "Backspace": pressedKey = "Backspace"; break;
      }

      // 🔑 Normalize letters for highlighting only
      let normalizedPressedKey = pressedKey;
      if (pressedKey.length === 1) {
        normalizedPressedKey = pressedKey.toUpperCase();
      }

      setActiveKey(normalizedPressedKey);
      handleKeyPress(pressedKey); // pass original key for typing
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftActive(false);
      setActiveKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startTime]);

  // Update WPM & accuracy as user types
  useEffect(() => {
    if (!startTime) return;

    const correctChars = typedText
      .split("")
      .reduce((acc, char, idx) => (char === targetText[idx] ? acc + 1 : acc), 0);

    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    setWPM(Math.round((typedText.length / 5) / elapsedMinutes));
    setAccuracy(Math.round((correctChars / typedText.length) * 100) || 100);
  }, [typedText, startTime, targetText]);

  // Render target text with per-character coloring and next-character highlight
  const renderText = () => {
    return targetText.split("").map((char, idx) => {
      const typedChar = typedText[idx];
      let color: string = "black";
      if (typedChar != null) color = typedChar === char ? "green" : "red";

      const isNextChar = idx === typedText.length;
      return (
        <span
          key={idx}
          style={{
            color,
            textDecoration: isNextChar ? "underline" : "none",
            fontWeight: isNextChar ? "bold" : "normal",
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Typing Practice
      </Typography>

      <Paper sx={{ p: 2, minHeight: "120px", mb: 2 }}>
        <Typography component="div" sx={{ fontSize: "1.2rem", wordWrap: "break-word" }}>
          {renderText()}
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
        <Typography>WPM: {wpm}</Typography>
        <Typography>Accuracy: {accuracy}%</Typography>
        <Button variant="contained" onClick={newSentence}>New Sentence</Button>
      </Box>

      <Keyboard onKeyPress={handleKeyPress} activeKey={activeKey} shiftActive={shiftActive} />
    </Box>
  );
};

export default TypingPractice;
