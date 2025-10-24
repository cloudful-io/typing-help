'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Box, Grid, Typography, Paper, TextField, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import AccuracyCard from '@/app/(DashboardLayout)/components/shared/AccuracyCard';
import WPMCard from '@/app/(DashboardLayout)/components/shared/WPMCard';
import TimerControlCard from '@/app/(DashboardLayout)/components/shared/TimerControlCard';
import TimeUpModal from '@/app/(DashboardLayout)/components/shared/TimeUpModal'
import { computeTypingResults, countWords } from "@/utils/typing";
import { usePracticeSessions, buildCharacterStats } from "@/hooks/usePracticeSessions";
import { PracticeTextService } from '@/services/practice-text-service';
import Link from "next/link";

interface PracticeProps {
  id?: string;
}

const Practice: React.FC<PracticeProps> = ({ id }) => {
  type SessionState = "idle" | "running" | "paused" | "ended";
  const [sessionState, setSessionState] = useState<SessionState>("idle");

  const canType = sessionState === "running";
  const sessionActive = sessionState === "running" || sessionState === "paused";
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const [textId, setTextId] = useState(0);
  const [classId, setClassId] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [targetText, setTargetText] = useState<string>("");
  const [committedTextLength, setCommittedTextLength] = useState(0);

  const [wpm, setWPM] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);

  const [language, setLanguage] = useState("zh-Hant");
  const [isComposing, setIsComposing] = useState(false);

  const textboxRef = useRef<HTMLInputElement>(null);

  const resetTypingState = useCallback(() => {
    setTypedText("");
    setTotalChars(0);
    setCorrectChars(0);
    setWPM(null);
    setCommittedTextLength(0);
  }, []);

  // Fetch practice text 
  const fetchPracticeText = useCallback(async (selectedLanguage?: string) => {
    const lang = selectedLanguage || language;
    try {
      let data;

      if (id) {
        // fetch specific practice text by ID
        data = await PracticeTextService.getPracticeTextById(Number(id));

        if (data) {
          setClassId(data.class_id!);
        }
      } else {
        // fetch random practice text
        data = await PracticeTextService.getPublicPracticeText(lang);
      }

      if (!data || typeof data !== 'object' || !data.content) {
        console.warn('Invalid or missing practice text:', data);
        setTargetText('');
        setSessionState('ended');
        return;
      }
      setTextId(data.id);
      setTargetText(data.content);
      setLanguage(data.language);

      resetTypingState();
    } catch (err) {
      console.error("Error fetching practice text:", err);
      setTargetText("");
      setSessionState("ended");
    }
  }, [id, language, resetTypingState]);

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

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canType) return;
    setTypedText(e.target.value);
  };

  const handleCompositionStart = (e: any) => {
    setIsComposing(true);
    setCommittedTextLength(e.target.value.length);
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

    saveSessionStats(elapsedSeconds, wpm, correct, total);
  };

  const { savePracticeSession } = usePracticeSessions();

  const saveSessionStats = (elapsedSeconds: number, wpm: number, correctChars: number, totalChars: number) => {
    const characterStats = buildCharacterStats(targetText, typedText);

    savePracticeSession({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      language,
      wpm: wpm || 0,
      total_chars: totalChars,
      correct_chars: correctChars,
      words_typed: wordsTyped,
      duration: elapsedSeconds,
      character_stats: characterStats,
      text_id: textId,
      user_id: "",
    });
  }

  const renderPracticeText = () => {
  // Determine the length to consider for highlighting
  const highlightLength = isComposing ? committedTextLength : typedText.length;

  return targetText.split("").map((char, idx) => {
    const typedChar = typedText[idx];
    let color: string = "black";

    // Only evaluate correctness if not composing
    if (!isComposing && typedChar != null) {
      color = typedChar === char ? "green" : "red";
    }
    else if (isComposing && committedTextLength > 0 && typedChar != null && idx < committedTextLength) {
      color = typedChar === char ? "green" : "red";
    }

    // Underline/bold only the next character
    const isNextChar = idx === highlightLength;

    if (char === "\n") {
    return (
      <span key={idx} style={{ color }}>
        <br/>
      </span>
    );
  }
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
    <PageContainer title="Practice Mode" description="Typing Help: Practice Mode">
      <Container sx={{ mt: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
          {id && classId > 0 &&
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
              <Typography
                component={Link}
                href={`/class/${classId}`}
                color="primary"
                sx={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { textDecoration: "underline" },
                  fontWeight: 500,
                }}
              >
                ← Back to Assignment List
              </Typography>
            </Box>
          }
          <TimeUpModal open={showTimeUpModal} onClose={() => setShowTimeUpModal(false)} />
          {/* Top row: Accuracy, WPM, Timer/Controls */}
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flex: 1 }}>
              <AccuracyCard correct={correctChars} total={totalChars} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flex: 1 }}>
              <WPMCard wpm={wpm} wordsTyped={wordsTyped} language={language} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ flex: 1 }}>
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
                onReset={() => {
                  resetTypingState();
                  setSessionState("ended");
                }}
                onSessionEnd={(elapsedSeconds) => {
                  setSessionState("ended");
                  computeResults(elapsedSeconds);
                  setShowTimeUpModal(true);
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Show Language selector and Load New Sentence button only if id is not specified */}
            {!id &&
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
            }
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
          </Box>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default Practice;