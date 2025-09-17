import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Grid, Typography, Paper, TextField, FormControlLabel, Switch } from "@mui/material";
import Keyboard from "./Keyboard";
import AccuracyCard from '@/app/(DashboardLayout)/components/shared/AccuracyCard';
import WPMCard from '@/app/(DashboardLayout)/components/shared/WPMCard';
import TimerControlCard from '@/app/(DashboardLayout)/components/shared/TimerControlCard'


const TypingPractice: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [targetText, setTargetText] = useState<string>("");;
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [shiftActive, setShiftActive] = useState(false);

  const [timer, setTimer] = useState(60);       // countdown
  const [duration, setDuration] = useState(60); // selected session duration
  const [running, setRunning] = useState(false);

  const [wpm, setWPM] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);

  const [chineseMode, setChineseMode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textboxRef = useRef<HTMLInputElement>(null);

  // 🔹 Fetch practice text from API
  const fetchPracticeText = async (mode?: boolean) => {
    try {
      const language = mode !== undefined ? (mode ? "zh-Hant" : "en-US") : (chineseMode ? "zh-Hant" : "en-US");
      const res = await fetch(`/api/practice-text?language=${language}`);
      if (!res.ok) throw new Error("Failed to fetch practice text");

      const data = await res.json();
      setTargetText(data.content);

      // detect Chinese
      setChineseMode(/\p{Script=Han}/u.test(data.content));

      // reset state
      setTypedText("");
      setTimer(duration);
      setRunning(false);
      setWPM(null);
      setAccuracy(null);
      setActiveKey(null);
      setShiftActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err) {
      console.error(err);
    }
  };

  // Load initial practice text
  useEffect(() => {
    fetchPracticeText();
  }, []);

  // Start a new sentence
  const newSentence = () => {
    fetchPracticeText();
  };

  const wordsTyped = useMemo(() => {
    if (!typedText.trim()) return 0;

    if (chineseMode) {
      const chars = typedText.match(/\p{Script=Han}/gu) || [];
      return chars.length;
    }

    return typedText.trim().split(/\s+/).length;
  }, [typedText, chineseMode]);

  const handleTyping = (key: string) => {
    if (!running) return; // Only allow typing during session
    if (key === "Backspace") setTypedText((prev) => prev.slice(0, -1));
    else if (key === "Enter") setTypedText((prev) => prev + "\n");
    else if (key === "Space" || key === " ") setTypedText((prev) => prev + " ");
    else if (!["Shift", "Ctrl", "Meta", "Alt", "Caps", "Tab", "Menu"].includes(key)) {
      setTypedText((prev) => prev + key);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!running) return;
    setTypedText(e.target.value);
  };

  const handlePaste = (event: any) => {
    event.preventDefault(); // Prevent pasting
  };

  const handleDurationChange = (duration: number) => {
    setTimer(duration);    // ✅ reset countdown to new duration
    setRunning(false);     // optional: stop any active countdown
  };

  const handleLanguageToggle = (isChinese: boolean) => {
    setChineseMode(isChinese);   // 1️⃣ update language mode
    fetchPracticeText(isChinese);               // 2️⃣ fetch a new sentence for the selected language
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
      let normalizedPressedKey = pressedKey;
      if (pressedKey.length === 1) normalizedPressedKey = pressedKey.toUpperCase();
      setActiveKey(normalizedPressedKey);
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

  // Timer countdown
  useEffect(() => {
    if (!running) return;
    if (timer <= 0) {
      setRunning(false);
      computeResults();
      return;
    }

    timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [running, timer]);

  // Start session with chosen duration
  const startSession = (selectedDuration: number) => {
    if (!running) {
      textboxRef.current?.focus();
      setTypedText("");
      setDuration(selectedDuration);
      setTimer(selectedDuration);
      setRunning(true);
      setWPM(null);
      setAccuracy(null);
      setCorrectChars(0);
      setTotalChars(0);
    }
  };

  const computeResults = () => {
    const correct = typedText
      .split("")
      .reduce((acc, char, idx) => (char === targetText[idx] ? acc + 1 : acc), 0);

    const total = typedText.length;

    const elapsedMinutes = duration / 60;
    
    let calculatedSpeed: number;
    if (chineseMode) {
      // Characters per minute
      const charsTyped = (typedText.match(/\p{Script=Han}/gu) || []).length;
      calculatedSpeed = Math.round(charsTyped / elapsedMinutes);
    } else {
      // Words per minute
      calculatedSpeed = Math.round(wordsTyped / elapsedMinutes);
    }

    const calculatedAccuracy = total > 0
      ? Math.round((correct / total) * 100)
      : 0;

    setWPM(calculatedSpeed);
    setAccuracy(calculatedAccuracy);
    setCorrectChars(correct);
    setTotalChars(total);
  };

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>

      {/* Top row: Accuracy, WPM, Timer/Controls */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={4} sx={{ display: "flex", flex: 1 }}>
          <AccuracyCard accuracy={accuracy} correct={correctChars} total={totalChars} />
        </Grid>
        <Grid size={4} sx={{ display: "flex", flex: 1 }}>
          <WPMCard wpm={wpm} wordsTyped={wordsTyped} chineseMode={chineseMode} />
        </Grid>
        <Grid size={4} sx={{ display: "flex", flex: 1 }}>
          <TimerControlCard
            timer={timer}
            running={running}
            onStart={startSession}       // now takes duration
            onNewSentence={newSentence}
            onDurationChange={handleDurationChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <FormControlLabel
            control={
              <Switch
                checked={chineseMode}
                onChange={(e) => handleLanguageToggle(e.target.checked)}
              />
            }
            label={chineseMode ? "中文" : "English"}
          />
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
          onPaste={handlePaste}
          multiline
          fullWidth
          minRows={3}
          variant="outlined"
          placeholder="Start typing here..."
          sx={{ fontSize: "1.1rem" }}
        />

        <Keyboard onKeyPress={handleTyping} activeKey={activeKey} shiftActive={shiftActive} />
      </Box>
    </Box>
  );
};

export default TypingPractice;
