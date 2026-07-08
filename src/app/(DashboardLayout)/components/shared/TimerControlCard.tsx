"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { keyframes } from "@mui/system";
import {
  Box,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { getTimerControlColor } from "@/utils/typing";

const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
  100% { transform: translate(-50%, -50%) scale(1); }
`;

interface TimerControlsCardProps {
  presetTimes?: number[];
  initialSelectedTime?: number;
  onStart?: (duration: number) => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  onDurationChange?: (duration: number) => void;
  onSessionEnd?: (elapsedSeconds: number) => void;
}

const TimerControlsCard: React.FC<TimerControlsCardProps> = ({
  presetTimes = [30, 60, 120, 240],
  initialSelectedTime,
  onStart,
  onPause,
  onResume,
  onReset,
  onDurationChange,
  onSessionEnd,
}) => {
  const [selectedTime, setSelectedTime] = useState<number>(initialSelectedTime ?? presetTimes[1] ?? 60);
  const [timer, setTimer] = useState<number>(selectedTime);
  const [elapsed, setElapsed] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const isUntimed = selectedTime === 0;

  // Keep selectedTime valid if presetTimes prop changes
  useEffect(() => {
    if (!presetTimes.includes(selectedTime)) {
      const fallback = presetTimes[0] ?? 60;
      setSelectedTime(fallback);
      onDurationChange?.(fallback);
    }
  }, [presetTimes, onDurationChange, selectedTime]);

  useEffect(() => {
    if (initialSelectedTime != null) {
      setSelectedTime(initialSelectedTime);
      setTimer(initialSelectedTime);
    }
  }, [initialSelectedTime]);
  
  // Update timer when selectedTime changes
  useEffect(() => {
    if (!isUntimed) setTimer(selectedTime);
  }, [selectedTime, isUntimed]);

  // Countdown effect (timed mode)
  useEffect(() => {
    if (!running || isUntimed) return;

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
  }, [running, timer, selectedTime, isUntimed]);

  // Count-up effect (untimed mode)
  useEffect(() => {
    if (!running || !isUntimed) return;

    intervalRef.current = window.setTimeout(() => setElapsed((e) => e + 1), 1000);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [running, elapsed, isUntimed]);

  const handleTimeToggle = (_e: React.MouseEvent<HTMLElement>, newTime: number | string | null) => {
    if (newTime != null) {
      const val = Number(newTime);
      setSelectedTime(val);
      setTimer(val);
      onDurationChange?.(val);
    }
  };

  const handleStart = () => {
    if (!isUntimed) setTimer(selectedTime);
    setElapsed(0);
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
    setElapsed(0);
    if (!isUntimed) setTimer(selectedTime);
    onReset?.();
  };

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setRunning(false);
    setPaused(false);
    setElapsed(0);
    onSessionEnd?.(elapsed);
  }, [elapsed, onSessionEnd]);

  const { progress, color } = useMemo(() => ({
    progress: isUntimed ? 100 : (selectedTime > 0 ? (timer / selectedTime) * 100 : 0),
    color: isUntimed ? "primary.main" : getTimerControlColor(timer, selectedTime),
  }), [timer, selectedTime, isUntimed]);


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
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center",
              color: !isUntimed && timer <= 5 ? "error.main" : "text.primary",
              animation: !isUntimed && timer > 0 && timer <= 5 ? `${pulse} 1s infinite` : "none", 
            }}
          >
            {isUntimed ? (
              `${elapsed}s`
            ) : (
              `${timer}s`
            )}
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <ToggleButtonGroup value={selectedTime} exclusive onChange={handleTimeToggle} disabled={running || paused} size="small">
            {presetTimes.map((t) => (
              <ToggleButton key={t} value={t}>
                {t === 0 ? "Untimed" : `${t}s`}
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
            {isUntimed ? (
              <Button variant="contained" color="error" onClick={handleStop} startIcon={<StopCircleOutlinedIcon />}>
                Stop
              </Button>
            ) : (
              <Button variant="contained" color="error" onClick={handleReset} startIcon={<RestartAltIcon />}>
                Restart
              </Button>
            )}
            </>
          )}

          {!running && paused && (
            <>
            <Button variant="contained" onClick={handleResume} startIcon={<PlayCircleOutlineIcon />}>
              Resume
            </Button>
            <Button variant="contained" color="error" onClick={isUntimed ? handleStop : handleReset} startIcon={isUntimed ? <StopCircleOutlinedIcon /> : <RestartAltIcon />}>
              {isUntimed ? "Stop" : "Reset"}
            </Button>
            </>
          )}
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default TimerControlsCard;
