'use client';

import { useEffect, useState } from 'react';
import TypingClassService from "@/services/typing-class-service";

import { Typography, List, ListItem, ListItemText } from '@mui/material';
import Loading from '@/app/loading';

interface StudentsListProps {
  classId: string;
}

export default function StudentsList({ classId }: StudentsListProps) {
  const [students, setStudents] = useState<{ id: string; display_name: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      const data = await TypingClassService.getStudentsForClass(classId);
      setStudents(data);
      setLoading(false);
    }
    fetchStudents();
  }, [classId]);

  if (loading) return <Loading/>;
  if (students.length === 0) return <Typography>No students in this class.</Typography>;

  return (
    <List>
      {students.map((student) => (
        <ListItem key={student.id}>
          <ListItemText primary={student.display_name} />
        </ListItem>
      ))}
    </List>
  );
}
