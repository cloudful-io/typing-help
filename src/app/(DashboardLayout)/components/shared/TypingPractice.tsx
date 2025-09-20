import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Box, Grid, Typography, Paper, TextField, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import Keyboard from "./Keyboard";
import AccuracyCard from '@/app/(DashboardLayout)/components/shared/AccuracyCard';
import WPMCard from '@/app/(DashboardLayout)/components/shared/WPMCard';
import TimerControlCard from '@/app/(DashboardLayout)/components/shared/TimerControlCard';
import { computeTypingResults, countWords } from "@/utils/typing";

const TypingPractice: React.FC = () => {
  type SessionState = "idle" | "running" | "paused" | "ended";
  const [sessionState, setSessionState] = useState<SessionState>("idle");

  const canType = sessionState === "running";
  const sessionActive = sessionState === "running" || sessionState === "paused";

  const [typedText, setTypedText] = useState("");
  const [targetText, setTargetText] = useState<string>("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [shiftActive, setShiftActive] = useState(false);

  const [wpm, setWPM] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);

  const [language, setLanguage] = useState("en-US");
  const [isComposing, setIsComposing] = useState(false);

  const textboxRef = useRef<HTMLInputElement>(null);

  const resetTypingState = useCallback(() => {
    setTypedText("");
    setTotalChars(0);
    setCorrectChars(0);
    setWPM(null);
    setActiveKey(null);
    setShiftActive(false);
  }, []);

  // Fetch practice text from API
  const fetchPracticeText = useCallback(async (selectedLanguage?: string) => {
    const lang = selectedLanguage || language;
    try {
      const res = await fetch(`/api/practice-text?language=${lang}`);
      if (!res.ok) throw new Error("Failed to fetch practice text");

      const data = await res.json();
      setTargetText(data.content);
      setLanguage(lang);

      resetTypingState();
    } catch (err) {
      console.error(err);
    }
  }, [language, resetTypingState]);

  useEffect(() => {
    fetchPracticeText();
  }, [fetchPracticeText]);

  const handleNewSentence = () => {
    fetchPracticeText();
  };

  const wordsTyped = useMemo(
    () => countWords(typedText, language),
    [typedText, language]
  );

  const handleTyping = (key: string) => {
    if (!canType) return;
    if (key === "Backspace") setTypedText((prev) => prev.slice(0, -1));
    else if (key === "Enter") setTypedText((prev) => prev + "\n");
    else if (key === "Space" || key === " ") setTypedText((prev) => prev + " ");
    else if (!["Shift", "Ctrl", "Meta", "Alt", "Caps", "Tab", "Menu"].includes(key)) {
      setTypedText((prev) => prev + key);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canType) return;
    setTypedText(e.target.value);
  };

  const handleCompositionStart = (e: any) => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: any) => {
    setIsComposing(false);
  };

  const handlePaste = (event: any) => {
    event.preventDefault(); // prevent pasting
  };

  const handleLanguageChange = (
    event: React.MouseEvent<HTMLElement>,
    newLanguage: string | null
  ) => {
    if (newLanguage) fetchPracticeText(newLanguage);
  };

  // Physical key highlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let pressedKey = e.key;
      switch (pressedKey) {
        case " ": pressedKey = "Space"; break;
        case "CapsLock": pressedKey = "Caps"; break;
        case "Shift": pressedKey = "Shift"; setShiftActive(true); break;
        case "Enter": pressedKey = "Enter"; break;
        case "Tab": pressedKey = "Tab"; break;
        case "Backspace": pressedKey = "Backspace"; break;
      }
      if (pressedKey.length === 1) pressedKey = pressedKey.toUpperCase();
      setActiveKey(pressedKey);
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
  }, []);

  const computeResults = (elapsedSeconds: number) => {
    const { correct, total, wpm } = computeTypingResults(
      typedText,
      targetText,
      language,
      elapsedSeconds
    );

    setWPM(wpm);
    setCorrectChars(correct);
    setTotalChars(total);
  };

  const renderPracticeText = () => {
  // Determine the length to consider for highlighting
  const highlightLength = isComposing ? typedText.length - 1 : typedText.length;

  return targetText.split("").map((char, idx) => {
    const typedChar = typedText[idx];
    let color: string = "black";

    // Only evaluate correctness if not composing
    if (!isComposing && typedChar != null) {
      color = typedChar === char ? "green" : "red";
    }

    // Underline/bold only the next character
    const isNextChar = idx === highlightLength;

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      {/* Top row: Accuracy, WPM, Timer/Controls */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", flex: 1 }}>
          <AccuracyCard correct={correctChars} total={totalChars} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", flex: 1 }}>
          <WPMCard wpm={wpm} wordsTyped={wordsTyped} language={language} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ flex: 1 }}>
          <TimerControlCard
            presetTimes={[30, 60, 120, 240]}
            onStart={(duration) => {
              setSessionState("running");
              resetTypingState();
              textboxRef.current?.focus();
            }}
            onPause={() => {
              setSessionState("paused")
            }}
            onResume={() => {
              setSessionState("running");
              textboxRef.current?.focus();
            }}
            onSessionEnd={(elapsedSeconds) => {
              setSessionState("ended");
              computeResults(elapsedSeconds);
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" size="small" disabled={sessionActive} onClick={handleNewSentence}>
            Load New Sentence
          </Button>
          <ToggleButtonGroup
            value={language}
            size="small"
            disabled={sessionActive}
            exclusive
            onChange={handleLanguageChange}
            aria-label="language selector"
          >
            <ToggleButton value="en-US" aria-label="English">
              English
            </ToggleButton>
            <ToggleButton value="zh-Hant" aria-label="Chinese">
              中文
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Paper sx={{ p: 2, minHeight: "100px" }}>
          <Typography component="div" sx={{ fontSize: "1.1rem", wordWrap: "break-word" }}>
            {targetText ? renderPracticeText() : "Loading practice text..."}
          </Typography>
        </Paper>

        <TextField
          inputRef={textboxRef}
          value={typedText}
          onChange={handleTextFieldChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onPaste={handlePaste}
          multiline
          fullWidth
          minRows={5}
          variant="outlined"
          placeholder="Click on the Start button to start typing..."
          sx={{ fontSize: "1.1rem" }}
        />

        <Keyboard onKeyPress={handleTyping} activeKey={activeKey} shiftActive={shiftActive} />
      </Box>
    </Box>
  );
};

export default TypingPractice;