"use client";

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface TimerControlsCardProps {
  timer: number;          // seconds left
  running: boolean;
  onStart: () => void;
  onNewSentence: () => void;
  totalTime?: number;     // optional, default 60
}

const TimerControlsCard: React.FC<TimerControlsCardProps> = ({
  timer,
  running,
  onStart,
  onNewSentence,
  totalTime = 60,
}) => {
  // Determine color based on remaining time
  const color =
    timer / totalTime > 0.25
      ? "success.main"
      : timer / totalTime > 0.1
      ? "warning.main"
      : "error.main";

  return (
    <DashboardCard title="Timer">
      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        {/* Radial countdown */}
        <Box position="relative" display="inline-flex" sx={{ pt: 2 }}>
          <CircularProgress
            variant="determinate"
            value={(timer / totalTime) * 100}
            size={80}
            thickness={6}
            sx={{ color }}
          />
          <Box
            position="absolute"
            top="58%" // Need to be greater than 50% for number to be completely centered
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">{timer} s</Typography>
          </Box>
        </Box>

        {/* Buttons */}
        {!running && (
          <Button variant="contained" onClick={onStart}>
            Start 1-Minute Session
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
