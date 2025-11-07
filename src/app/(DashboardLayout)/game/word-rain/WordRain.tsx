"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { GameResult } from "@/types/game";
import { WordBankService } from "@/services/word-service";

// Props type
interface WordRainProps {
  onFinish?: (result: GameResult) => void;
}

// Single falling word
type FallingWord = {
  id: number;
  text: string;
  y: number;
  speed: number;
  x: number;
};

// Floating points animation
type FloatingScore = {
  id: number;
  value: number;
  x: number;
  y: number;
};

export const WordRain: React.FC<WordRainProps> = ({ onFinish }) => {
  const [wordPool, setWordPool] = useState<string[]>([]);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [scoreAnim, setScoreAnim] = useState(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (!gameStarted) return;

  async function fetchWords() {
    const words = await WordBankService.getWords("en-US"); 
    setWordPool(words);
  }

  fetchWords();
}, [gameStarted]);

  // Focus input when game starts
  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  // Spawn words
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    if (wordPool.length === 0) return;

    const interval = setInterval(() => {
      const newWord: FallingWord = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: wordPool[Math.floor(Math.random() * wordPool.length)],
        y: 0,
        // Increase speed slightly as score increases
        speed: 0.4 + Math.random() * 1 + score / 200,
        x: 5 + Math.random() * 90,
      };
      setWords(prev => [...prev, newWord]);
    }, 1200);

    return () => clearInterval(interval);
  }, [gameOver, gameStarted, score, wordPool]);

  // Animate falling words
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const tick = setInterval(() => {
      setWords(prevWords => {
        const moved = prevWords.map(w => ({ ...w, y: w.y + w.speed }));
        const survived = moved.filter(w => w.y < 90);
        const missed = moved.length - survived.length;

        if (missed > 0) {
          setLives(prev => Math.max(prev - missed, 0));
          setCombo(0); // reset combo when a word is missed
        }

        return survived;
      });
    }, 50);

    return () => clearInterval(tick);
  }, [gameOver, gameStarted]);

  // Typing logic
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInput(value);

    if (!gameStarted) {
      setGameStarted(true);
      setShowInstructions(false);
    }

    const match = words.find(w => w.text === value);
    if (match) {
      setWords(prev => prev.filter(w => w.id !== match.id));

      // Increment combo
      setCombo(prev => prev + 1);

      // Calculate multiplier
      const multiplier = 1 + Math.floor((combo + 1) / 5);
      const points = 10 * multiplier;

      setScore(s => s + points);
      setScoreAnim(true);
      setTimeout(() => setScoreAnim(false), 200);

      setFloatingScores(prev => [
        ...prev,
        { id: Date.now(), value: points, x: Math.random() * 80 + 10, y: 90 },
      ]);

      setInput("");
    }
  };

  // Handle game over
  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      setGameOver(true);
    }
  }, [lives, gameOver]);

  // Trigger onFinish
  useEffect(() => {
    if (gameOver && lives <= 0) {
      onFinish?.({ score, timestamp: Date.now() });
    }
  }, [gameOver, lives, score, onFinish]);

  // Restart game
  const handleRestart = () => {
    setWords([]);
    setInput("");
    setScore(0);
    setCombo(0);
    setLives(5);
    setGameOver(false);
    setShowInstructions(true);
    setGameStarted(false);
    setFloatingScores([]);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 400,
        p: 2,
        border: "2px solid #90caf9",
        borderRadius: 2,
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)"
            : "linear-gradient(180deg, #0d47a1 0%, #002171 100%)",
        color: theme.palette.text.primary,
      }}
    >
      {/* Score & Lives */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: scoreAnim ? "2rem" : "1.5rem",
              color:
                theme.palette.mode === "light"
                  ? "primary.main"
                  : "secondary.light",
              transition: "all 0.2s ease",
            }}
          >
            Score: {score}
          </Typography>
          {combo > 1 && (
            <Typography
              sx={{ fontSize: "0.9rem", color: "orange", fontWeight: 600 }}
            >
              Combo x{1 + Math.floor(combo / 5)}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {Array.from({ length: lives }, (_, i) => (
            <FavoriteIcon key={i} sx={{ color: "red", mr: 0.5 }} />
          ))}
        </Box>
      </Box>

      {/* Falling words */}
      {words.map(w => (
        <Typography
          key={w.id}
          sx={{
            position: "absolute",
            top: `${w.y}%`,
            left: `${w.x}%`,
            transition: "top 0.05s linear",
            pointerEvents: "none",
            userSelect: "none",
            color:
              theme.palette.mode === "light"
                ? theme.palette.primary.dark
                : theme.palette.primary.light,
            fontWeight: 600,
          }}
        >
          {w.text}
        </Typography>
      ))}

      {/* Floating points animation */}
      {floatingScores.map(f => (
        <Typography
          key={f.id}
          sx={{
            position: "absolute",
            left: `${f.x}%`,
            top: `${f.y}%`,
            color: "gold",
            fontWeight: 700,
            fontSize: "1rem",
            pointerEvents: "none",
            animation: "floatUp 1s ease-out forwards",
          }}
        >
          +{f.value}
        </Typography>
      ))}

      {/* Input box */}
      {gameStarted && !gameOver && (
        <Box
          sx={{
            mx: 4,
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
          }}
        >
          <TextField
            value={input}
            onChange={handleInput}
            inputRef={inputRef}
            fullWidth
            size="small"
            placeholder="Type here..."
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: theme.palette.mode === "light" ? "white" : "#1e1e1e",
              px: 0,
              "& .MuiInputBase-input": {
                color: theme.palette.mode === "light" ? "black" : "white",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "#ccc" : "#555",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            }}
            autoFocus
          />
        </Box>
      )}

      {/* Overlay instructions */}
      {showInstructions && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(255,255,255,0.9)"
                : "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 2,
            borderRadius: 2,
            zIndex: 10,
          }}
        >
          <Typography variant="h6" gutterBottom>
            💡 How to Play
          </Typography>
          <List dense>
            <ListItem sx={{ display: "list-item", pl: 2 }}>
              Words will fall from the top of the screen.
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 2 }}>
              Type each word exactly into the box below before it reaches the bottom.
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 2 }}>
              Each correct word gives you +10 points. You have 5 lives.
            </ListItem>
          </List>
          <Button
            variant="contained"
            onClick={() => {
              setShowInstructions(false);
              setGameStarted(true);
            }}
            sx={{ mt: 4 }}
          >
            Start Game
          </Button>
        </Box>
      )}

      {/* Play Again button */}
      {gameOver && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" onClick={handleRestart}>
            Play Again
          </Button>
        </Box>
      )}

      {/* Floating points animation CSS */}
      <style>
        {`
          @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-40px); }
          }
        `}
      </style>
    </Box>
  );
};
