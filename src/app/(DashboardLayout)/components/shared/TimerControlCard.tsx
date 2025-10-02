"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { keyframes } from "@mui/system";
import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { getTimerControlColor } from "@/utils/typing";

const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
  100% { transform: translate(-50%, -50%) scale(1); }
`;

interface TimerControlsCardProps {
  presetTimes?: number[];
  onStart?: (duration: number) => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  onDurationChange?: (duration: number) => void;
  onSessionEnd?: (elapsedSeconds: number) => void;
}

const TimerControlsCard: React.FC<TimerControlsCardProps> = ({
  presetTimes = [30, 60, 120, 240],
  onStart,
  onPause,
  onResume,
  onReset,
  onDurationChange,
  onSessionEnd,
}) => {
  const [selectedTime, setSelectedTime] = useState<number>(presetTimes[1] ?? 60);
  const [timer, setTimer] = useState<number>(selectedTime);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // Keep selectedTime valid if presetTimes prop changes
  useEffect(() => {
    if (!presetTimes.includes(selectedTime)) {
      const fallback = presetTimes[0] ?? 60;
      setSelectedTime(fallback);
      onDurationChange?.(fallback);
    }
  }, [presetTimes]);

  // Update timer when selectedTime changes
  useEffect(() => {
    setTimer(selectedTime);
  }, [selectedTime]);

  // Countdown effect
  useEffect(() => {
    if (!running) return;

    if (timer <= 0) {
      setRunning(false);
      setPaused(false);
      onSessionEnd?.(selectedTime);
      return;
    }

    intervalRef.current = window.setTimeout(() => setTimer((t) => t - 1), 1000);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [running, timer]);

  const handleTimeToggle = (_e: React.MouseEvent<HTMLElement>, newTime: number | string | null) => {
    if (newTime != null) {
      const val = Number(newTime);
      setSelectedTime(val);
      setTimer(val);
      onDurationChange?.(val);
    }
  };

  const handleStart = () => {
    setTimer(selectedTime);
    setRunning(true);
    setPaused(false);
    onStart?.(selectedTime);
  };

  const handlePause = () => {
    setRunning(false);
    setPaused(true);
    onPause?.();
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  const handleResume = () => {
    setRunning(true);
    setPaused(false);
    onResume?.();
  };

  const handleReset = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setRunning(false);
    setPaused(false);
    setTimer(selectedTime);
    onReset?.();
  }

  const { progress, color } = useMemo(() => ({
    progress: selectedTime > 0 ? (timer / selectedTime) * 100 : 0,
    color: getTimerControlColor(timer, selectedTime),
  }), [timer, selectedTime]);


  return (
    <DashboardCard title="Timer Control">
      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        {/* Countdown circle */}
        <Box position="relative" display="inline-flex" sx={{ pt: 2 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={80}
            thickness={6}
            sx={{ color: "grey.300", position: "absolute" }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={6}
            sx={{ 
              color,
           }}
          />
          <Box
            position="absolute"
            top="58%"
            left="50%"
            sx={{ 
              transform: "translate(-50%, -50%)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: timer <= 5 ? "error.main" : "text.primary",
              animation: timer > 0 && timer <= 5 ? `${pulse} 1s infinite` : "none", 
            }}
          >
            {timer}s
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <ToggleButtonGroup value={selectedTime} exclusive onChange={handleTimeToggle} disabled={running || paused} size="small">
            {presetTimes.map((t) => (
              <ToggleButton key={t} value={t}>
                {t}s
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {!running && !paused && (
            <Button variant="contained" onClick={handleStart} startIcon={<PlayCircleOutlineIcon />}>
              Start
            </Button>
          )}

          {running && (
            <>
            <Button variant="contained" color="warning" onClick={handlePause} startIcon={<PauseCircleOutlineIcon />}>
              Pause
            </Button>
            <Button variant="contained" color="error" onClick={handleReset} startIcon={<RestartAltIcon />}>
              Restart
            </Button>
            </>
          )}

          {!running && paused && (
            <>
            <Button variant="contained" onClick={handleResume} startIcon={<PlayCircleOutlineIcon />}>
              Resume
            </Button>
            <Button variant="contained" color="error" onClick={handleReset} startIcon={<RestartAltIcon />}>
              Reset
            </Button>
            </>
          )}
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default TimerControlsCard;
