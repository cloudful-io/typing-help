"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

interface TimerControlsCardProps {
  timer: number;          // seconds left (from parent)
  running: boolean;
  onStart: (duration: number) => void;  // starts a session with given duration
  onNewSentence: () => void;
  presetTimes?: number[];
  onDurationChange?: (duration: number) => void; // NEW: notify parent when user picks a duration
}

const TimerControlsCard: React.FC<TimerControlsCardProps> = ({
  timer,
  running,
  onStart,
  onNewSentence,
  presetTimes = [30, 60, 120, 240], // default presets
  onDurationChange,
}) => {
  const [selectedTime, setSelectedTime] = useState<number>(presetTimes[1] ?? 60); // default 60s

  // Keep selectedTime valid if presetTimes prop ever changes
  useEffect(() => {
    if (!presetTimes.includes(selectedTime)) {
      const fallback = presetTimes[0] ?? 60;
      setSelectedTime(fallback);
      onDurationChange?.(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetTimes]);

  // progress is percentage of time remaining (100 -> 0)
  const progress = selectedTime > 0 ? (timer / selectedTime) * 100 : 0;

  const color =
    timer / selectedTime > 0.25
      ? "success.main"
      : timer / selectedTime > 0.1
      ? "warning.main"
      : "error.main";

  // Note: MUI ToggleButtonGroup may pass string values from the DOM,
  // so coerce with Number(...) to be safe.
  const handleTimeToggle = (
    _event: React.MouseEvent<HTMLElement>,
    newTime: number | string | null
  ) => {
    if (newTime != null) {
      const val = Number(newTime);
      setSelectedTime(val);
      // notify parent so it can reset its timer/duration
      onDurationChange?.(val);
    }
  };

  return (
    <DashboardCard title="Timer">
      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        {/* Radial countdown */}
        <Box position="relative" display="inline-flex" sx={{ pt: 2 }}>
          {/* Background circle (grey, always full) */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={80}
            thickness={6}
            sx={{ color: "grey.300", position: "absolute" }}
          />
          {/* Foreground progress (shrinks from full to 0) */}
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={6}
            sx={{ color }}
          />
          {/* Timer number (perfectly centered) */}
          <Box
            position="absolute"
            top="58%"
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">{timer}s</Typography>
          </Box>
        </Box>

        {/* Preset time selector */}
        <ToggleButtonGroup
          value={selectedTime}
          exclusive
          onChange={handleTimeToggle}
          size="small"
        >
          {presetTimes.map((t) => (
            <ToggleButton key={t} value={t}>
              {t}s
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Buttons */}
        {!running && (
          <Button variant="contained" onClick={() => onStart(selectedTime)}>
            Start {selectedTime}-Second Session
          </Button>
        )}
        <Button variant="outlined" onClick={onNewSentence}>
          New Sentence
        </Button>
      </Box>
    </DashboardCard>
  );
};

export default TimerControlsCard;
