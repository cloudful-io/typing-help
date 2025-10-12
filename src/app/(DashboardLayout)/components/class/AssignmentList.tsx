'use client';

import { useEffect, useState } from 'react';
import PracticeTextService from "@/services/practice-text-service";

import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface AssignmentListProps {
  classId: string;
}

export default function AssignmentList({ classId }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<{ id: number; owner_teacher_id: number | null; class_id: number | null; student_id: number | null; language: string; grade_level: number | null; duration_seconds: number; is_public: boolean | null; content: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  useEffect(() => {
    async function fetchPracticeText() {
      const data = await PracticeTextService.getPracticeTextByClass(Number(classId));
      console.log(data);
      setAssignments(data);
      setLoading(false);
    }
    fetchPracticeText();
  }, [classId]);

  if (loading) return <Typography>Loading assignments...</Typography>;
  if (assignments.length === 0) return <Typography>No assignments in this class.</Typography>;

  return (
    <List>
      {assignments.map((assignment) => (
        <ListItem key={assignment.id}>
          <ListItemText primary={truncateText(assignment.content, 50)} />
        </ListItem>
      ))}
    </List>
  );
}
