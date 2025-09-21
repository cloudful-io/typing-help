"use client";

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Box, Typography } from '@mui/material';

interface SessionCardProps {
  total: number;
  lastPractice?: Date;
}

const SessionCard: React.FC<SessionCardProps> = ({ total, lastPractice }) => {
  const lastPracticeDisplay = lastPractice && new Date(lastPractice).toLocaleDateString();

  return (
    <DashboardCard title="Typing Practice Sessions">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h1" color="text.primary" align="center" aria-label="total session" mb={2}>
          {total}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" aria-label="last session">
          {lastPractice ? `Last Session: ${lastPracticeDisplay}` : 'No sessions recorded yet'}
        </Typography>
      </Box>
    </DashboardCard>
  );
};

export default SessionCard;
