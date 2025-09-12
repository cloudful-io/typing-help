import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, TextField } from "@mui/material";
import Keyboard from "./Keyboard";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "你好，世界！",
  "小明每天放學後都會先寫作業，再出去跟朋友踢足球",
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
      // ignore modifiers
    } else {
      setTypedText((prev) => prev + key);
    }
  };

  // Handle physical key presses for highlighting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        let pressedKey = e.key;

        // Only normalize keys for highlighting (Shift, Caps, Backspace, Enter, Space)
        switch (pressedKey) {
            case " ": pressedKey = "Space"; break;
            case "CapsLock": pressedKey = "Caps"; break;
            case "Shift": pressedKey = "Shift"; setShiftActive(true); break;
            case "Meta": pressedKey = "Meta"; break;
            case "Enter": pressedKey = "Enter"; break;
            case "Tab": pressedKey = "Tab"; break;
            case "Backspace": pressedKey = "Backspace"; break;
        }

        let normalizedPressedKey = pressedKey;
        if (pressedKey.length === 1) normalizedPressedKey = pressedKey.toUpperCase();

        // Highlight key only
        setActiveKey(normalizedPressedKey);

        // Only handle special keys (optional, for Backspace / Enter / Space)
        /*if (["Backspace", "Enter", "Space"].includes(pressedKey)) {
            handleKeyPress(pressedKey);
        }*/
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

  // Update WPM & accuracy
  useEffect(() => {
    if (!startTime) return;

    const correctChars = typedText
      .split("")
      .reduce((acc, char, idx) => (char === targetText[idx] ? acc + 1 : acc), 0);

    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    setWPM(Math.round((typedText.length / 5) / elapsedMinutes));
    setAccuracy(Math.round((correctChars / typedText.length) * 100) || 100);
  }, [typedText, startTime, targetText]);

  // Render practice text with color and next-character underline
  const renderPracticeText = () => {
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

      {/* Practice text with red/green highlighting */}
      <Paper sx={{ p: 2, minHeight: "100px", mb: 1 }}>
        <Typography component="div" sx={{ fontSize: "1.2rem", wordWrap: "break-word" }}>
          {renderPracticeText()}
        </Typography>
      </Paper>

      {/* Typed text in a TextField */}
      <TextField
        value={typedText}
        onChange={(e) => setTypedText(e.target.value)}
        multiline
        fullWidth
        minRows={3}
        variant="outlined"
        placeholder="Start typing here..."
        sx={{ mb: 2 }}
        slotProps={{
            input: {sx: { fontSize: '1.2rem', lineHeight: 1.6, padding: '12px' },
            },
        }}
      />

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
