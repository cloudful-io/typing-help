"use client";
import { Box, Card, Typography, Button, useTheme } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import {
  computeTypingResults,
  calculateAccuracy,
  getAccuracyColor,
  getWPMColor,
} from "@/utils/typing"; // adjust import path

interface TypingTestProps {
  sentences?: string[];
  language?: string; // optional, default "en"
  targetWPM?: number; // optional for coloring
}

const defaultSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast requires practice and focus.",
  "Consistency is key to improving your speed and accuracy.",
];

export default function TypingTest({
  sentences = defaultSentences,
  language = "en",
  targetWPM = 60,
}: TypingTestProps) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [currentSentence, setCurrentSentence] = useState(
    sentences[Math.floor(Math.random() * sentences.length)]
  );
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState<{
    wpm: number | null;
    accuracy: number | null;
  }>({ wpm: null, accuracy: null });

  const [isFocused, setIsFocused] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!startTimeRef.current) startTimeRef.current = Date.now();

    if (value.length > currentSentence.length) return;

    setUserInput(value);

    // Auto-calculate results when finished typing
    if (value.length === currentSentence.length && startTimeRef.current) {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const { correct, total, wpm } = computeTypingResults(
        value,
        currentSentence,
        language,
        elapsedSeconds
      );

      setResults({
        wpm,
        accuracy: calculateAccuracy(correct, total),
      });
    }
  };

  const handleReset = () => {
    setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    setUserInput("");
    setResults({ wpm: null, accuracy: null });
    startTimeRef.current = null;

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const renderHighlighted = () => {
    return currentSentence.split("").map((char, index) => {
      const typedChar = userInput[index];
      const isCursor = index === userInput.length && isFocused && results.wpm === null;

      let color = theme.palette.text.disabled;
      if (typedChar !== undefined) color = typedChar === char ? theme.palette.success.main : theme.palette.error.main;

      const cursorColor = theme.palette.mode === "dark" ? "#cccccc" : "#333333";

      return (
        <span key={index} style={{ color, position: "relative" }}>
          {char}
          {isCursor && (
            <span
              style={{
                position: "absolute",
                left: "-1px",
                top: 0,
                bottom: 0,
                width: "2px",
                backgroundColor: cursorColor,
                animation: "blink 1s step-start infinite",
              }}
            />
          )}
        </span>
      );
    });
  };

  const wpmColor = getWPMColor(results.wpm, targetWPM);
  const accuracyColor = getAccuracyColor(results.accuracy, currentSentence.length);

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h4">Quick Test</Typography>
      </Box>
      {/* SCOREBOARD */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ opacity: 0.7 }}>
            Words Per Minute
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", minWidth: 80, color: wpmColor }}
          >
            {results.wpm ?? "?"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ opacity: 0.7 }}>
            Accuracy
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", minWidth: 80, color: accuracyColor }}
          >
            {results.accuracy !== null ? `${results.accuracy}%` : "?"}
          </Typography>
        </Box>
      </Box>

      {/* Typing Box */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          minHeight: 100,
          fontFamily: "monospace",
          fontSize: "1.8rem",
          lineHeight: 1.6,
          cursor: "text",
          backgroundColor: theme.palette.background.paper,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <Box sx={{ whiteSpace: "pre-wrap", pointerEvents: "none" }}>
          {renderHighlighted()}
        </Box>

        <input
          ref={inputRef}
          id="hiddenInput"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          value={userInput}
          onChange={handleChange}
          disabled={results.wpm !== null}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            fontSize: "1.8rem",
            fontFamily: "monospace",
            cursor: "text",
          }}
        />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="outlined" size="small" onClick={handleReset}>
          Try Again!
        </Button>
      </Box>
    </Card>
  );
}
