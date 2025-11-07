// app/games/word-rain/WordRain.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import type { GameResult } from "@/types/game";

// Props type
interface WordRainProps {
  onFinish?: (result: GameResult) => void; // optional to allow standalone rendering
}

// Single falling word
type FallingWord = {
  id: number;
  text: string;
  y: number;
  speed: number;
  x: number;
};

const WORDS = ["apple", "banana", "grape", "orange", "kiwi", "lemon", "melon", "one", "two", "three", "four", "five", "six"];

export const WordRain: React.FC<WordRainProps> = ({ onFinish }) => {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  // 🕹️ Spawn words
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newWord: FallingWord = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: WORDS[Math.floor(Math.random() * WORDS.length)],
        y: 0,
        speed: 0.4 + Math.random() * 1,
        x: 5 + Math.random() * 90,
      };
      setWords((prev) => [...prev, newWord]);
    }, 1200);

    return () => clearInterval(interval);
  }, [gameOver]);

  // 🎢 Animate falling words
  useEffect(() => {
  if (gameOver) return;

  const tick = setInterval(() => {
  setWords((prevWords) => {
    const moved = prevWords.map((w) => ({ ...w, y: w.y + w.speed }));
    const survived = moved.filter((w) => w.y < 90);

    // Calculate missed words before returning state
    const missed = moved.length - survived.length;

    // Use the missed value
    if (missed > 0) {
      setLives((prev) => Math.max(prev - missed, 0));
    }

    return survived;
  });
}, 50);


  return () => clearInterval(tick);
}, [gameOver]);



  // ⌨️ Typing logic
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInput(value);

    const match = words.find((w) => w.text === value);
    if (match) {
      setWords((prev) => prev.filter((w) => w.id !== match.id));
      setScore((s) => s + 10);
      setInput("");
    }
  };

  // 💀 Handle game over once
  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      setGameOver(true);
    }
  }, [lives, gameOver]);

  // 💥 Trigger onFinish after gameOver
  useEffect(() => {
    if (gameOver && lives <= 0) {
      onFinish?.({ score, timestamp: Date.now() });
    }
  }, [gameOver, lives, score, onFinish]);

  return (
    <Box
      sx={{
        position: "relative",
        height: 400,
        p: 2,
        border: "2px solid #90caf9",
        borderRadius: 2,
        background: "linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)",
      }}
    >
      <Typography variant="h6">💧 Word Rain</Typography>
      <Typography>
        Score: <strong>{score}</strong> | Lives: <strong>{lives}</strong>
      </Typography>

      {words.map((w) => (
        <Typography
          key={w.id}
          sx={{
            position: "absolute",
            top: `${w.y}%`,
            left: `${w.x}%`,
            transition: "top 0.05s linear",
            pointerEvents: "none",
            userSelect: "none",
            fontWeight: 600,
          }}
        >
          {w.text}
        </Typography>
      ))}

      {!gameOver && (
        <TextField
          value={input}
          onChange={handleInput}
          fullWidth
          size="small"
          placeholder="Type here..."
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "white",
          }}
          autoFocus
        />
      )}
    </Box>
  );
};
