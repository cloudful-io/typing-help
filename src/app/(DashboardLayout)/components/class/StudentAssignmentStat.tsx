'use client';

import { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import { PracticeSessionService } from '@/services/practice-session-service';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Database } from "@/types/database.types";
import Loading from '@/app/loading';

interface AssignmentStatProps {
  textId: string;
}

type PracticeSessionRow = Database["public"]["Tables"]["practice_sessions"]["Row"];

export default function StudentAssignmentStat({ textId }: AssignmentStatProps) {

  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<PracticeSessionRow[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const data = await PracticeSessionService.getByUserAndPracticeText(user.id, textId);
        if (data) setSessions(data);
      } catch (err) {
        console.error('Error fetching practice sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [textId, user?.id]);

  if (loading) {
    return <Loading/>;
  }

  if (!sessions.length) {
    return (
      <Chip label="Not Completed" color="error" variant="filled" />
    );
  }

  // --- Calculate stats ---
  const totalSessions = sessions.length;
  const totalChars = sessions.reduce((sum, s) => sum + s.total_chars, 0);
  const correctChars = sessions.reduce((sum, s) => sum + s.correct_chars, 0);

  const avgAccuracy = Math.round(correctChars / totalChars * 100);
  const avgWpm =
    sessions.reduce((sum, s) => sum + s.wpm, 0) / totalSessions;

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} py={1}>
        <Chip label={`Completed: ${totalSessions}`} color="success" variant="filled" />
        <Chip label={`Average Accuracy: ${avgAccuracy.toFixed(0)}%`} color="success" variant="outlined" />
        <Chip label={`Average WPM: ${avgWpm.toFixed(0)}`} color="success" variant="outlined" />
      </Box>
    </>
  );
}
