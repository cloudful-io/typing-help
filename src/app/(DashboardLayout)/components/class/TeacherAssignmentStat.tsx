'use client';

import { useState, useEffect } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Typography } from "@mui/material";
import {PracticeSessionService} from "@/services/practice-session-service";
import { Database } from "@/types/database.types";
import Loading from "@/app/loading";

interface TeacherAssignmentStatProps {
  textId: string;
}

type PracticeSessionRow = Database["public"]["Tables"]["practice_sessions"]["Row"];
type PracticeSessionWithUser = PracticeSessionRow & {
  display_name?: string;
};

export default function TeacherAssignmentStat({ textId }: TeacherAssignmentStatProps) {
  const [sessions, setSessions] = useState<PracticeSessionWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await PracticeSessionService.getByPracticeText(textId);
        setSessions(data);
      } catch (err) {
        console.error("Error fetching practice sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [textId]);

  if (loading) return <Loading/>;

  if (sessions.length === 0)
    return <Typography variant="body2" sx={{mt:2}}>No students have completed this assignment yet.</Typography>;

  return (
    <Box mt={2}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>WPM</TableCell>
            <TableCell>Accuracy</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {sessions.map((s) => (
            <TableRow key={s.id}>
            <TableCell>{s.display_name}</TableCell><TableCell>{s.wpm}</TableCell><TableCell>{s.total_chars > 0 ? Math.round((s.correct_chars / s.total_chars) * 100) : 0}%</TableCell><TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>
    </Box>
  );
}
