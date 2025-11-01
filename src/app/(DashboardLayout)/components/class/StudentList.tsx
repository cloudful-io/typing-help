'use client';

import { useEffect, useState } from 'react';
import TypingClassService from "@/services/typing-class-service";
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import UserAvatarName from '@/app/(DashboardLayout)/components/shared/UserAvatarName';
import Loading from '@/app/loading';

interface StudentsListProps {
  classId: string;
}
interface Student {
  id: string;
  display_name: string;
  avatar_url?: string | null;
}

export default function StudentsList({ classId }: StudentsListProps) {
  const [students, setStudents] = useState<Student[]>([]);
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
          <UserAvatarName
            displayName={student.display_name}
            avatarUrl={student.avatar_url}
            size={24}
          />
        </ListItem>
      ))}
    </List>
  );
}
