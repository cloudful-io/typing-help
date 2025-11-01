"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const WORDS = [
  "apple", "banana", "grape", "orange", "kiwi", "lemon", "melon", "mango",
  "pear", "plum", "berry", "peach", "lime", "coconut", "papaya",
];

type FallingWord = {
  id: number;
  text: string;
  y: number;      // vertical position (%)
  speed: number;  // pixels per frame or movement rate
  x: number;      // horizontal position (%)
};

export default function WordRainGame() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🕹️ Spawn new words every few seconds
  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(() => {
      const newWord: FallingWord = {
        id: Date.now(),
        text: WORDS[Math.floor(Math.random() * WORDS.length)],
        y: 0,
        speed: 0.3 + Math.random() * 1.2,
        x: 10 + Math.random() * 80, // position across width
      };
      setWords((prev) => [...prev, newWord]);
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  // 🎢 Animate falling words
  useEffect(() => {
    if (gameOver) return;

    const animation = setInterval(() => {
      setWords((prev) => {
        const updated = prev.map((w) => ({ ...w, y: w.y + w.speed }));
        const survived = updated.filter((w) => w.y < 90);
        const missed = updated.length - survived.length;

        if (missed > 0) setLives((l) => l - missed);
        return survived;
      });
    }, 50);

    return () => clearInterval(animation);
  }, [gameOver]);

  // 💥 Handle correct typing
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const match = words.find((w) => w.text === value);
    if (match) {
      setWords((prev) => prev.filter((w) => w.id !== match.id));
      setScore((s) => s + 10);
      setInput("");
    }
  };

  // 💀 Game over check
  useEffect(() => {
    if (lives <= 0) setGameOver(true);
  }, [lives]);

  const restart = () => {
    setWords([]);
    setScore(0);
    setLives(3);
    setInput("");
    setGameOver(false);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        height: 400,
        border: "2px solid #90caf9",
        overflow: "hidden",
        borderRadius: 2,
        background: "linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)",
        p: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6">💧 Word Rain</Typography>
        <Typography variant="body1">
          Score: <strong>{score}</strong> | Lives: <strong>{lives}</strong>
        </Typography>
      </Box>

      {/* Game Over Overlay */}
      {gameOver && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.9)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" mb={1}>
            Game Over!
          </Typography>
          <Typography variant="body1" mb={2}>
            Final Score: {score}
          </Typography>
          <Button variant="contained" onClick={restart}>
            Play Again
          </Button>
        </Box>
      )}

      {/* Falling Words */}
      {!gameOver &&
        words.map((word) => (
          <Typography
            key={word.id}
            sx={{
              position: "absolute",
              top: `${word.y}%`,
              left: `${word.x}%`,
              fontSize: 18,
              fontWeight: 500,
              color: "primary.dark",
              userSelect: "none",
              transition: "top 0.05s linear",
            }}
          >
            {word.text}
          </Typography>
        ))}

      {/* Input Field */}
      {!gameOver && (
        <TextField
          value={input}
          onChange={handleInput}
          variant="outlined"
          placeholder="Type a word..."
          fullWidth
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: "70%",
            bgcolor: "white",
            borderRadius: 1,
          }}
        />
      )}
    </Box>
  );
}
