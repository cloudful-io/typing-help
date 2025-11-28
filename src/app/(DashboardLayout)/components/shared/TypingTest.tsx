"use client";
import { Box, Card, Typography, TextField, Button, useTheme } from "@mui/material";
import { useState, useRef } from "react";

interface TypingTestProps {
  sentences?: string[]; // Optional custom sentences
}

const defaultSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast requires practice and focus.",
  "Consistency is key to improving your speed and accuracy.",
];

export default function TypingTest({ sentences = defaultSentences }: TypingTestProps) {
  const theme = useTheme();
  const [currentSentence, setCurrentSentence] = useState(
    sentences[Math.floor(Math.random() * sentences.length)]
  );
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState<{ wpm: number; accuracy: number } | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!startTimeRef.current) return;

    const endTime = Date.now();
    const timeMinutes = (endTime - startTimeRef.current) / 1000 / 60;
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeMinutes);

    const correctChars = currentSentence
      .split("")
      .filter((char, idx) => char === userInput[idx]).length;
    const accuracy = Math.round((correctChars / currentSentence.length) * 100);

    setResults({ wpm, accuracy });
  };

  const handleReset = () => {
    setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    setUserInput("");
    setResults(null);
    startTimeRef.current = null;
  };

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {currentSentence}
      </Typography>
      <TextField
        fullWidth
        placeholder="Start typing here..."
        value={userInput}
        onChange={handleChange}
        disabled={!!results}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!!results || !userInput}
        >
          Submit
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Box>

      {results && (
        <Box sx={{ mt: 2 }}>
          <Typography>Speed: {results.wpm} WPM</Typography>
          <Typography>Accuracy: {results.accuracy}%</Typography>
        </Box>
      )}
    </Card>
  );
}
