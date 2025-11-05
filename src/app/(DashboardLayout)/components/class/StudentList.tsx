'use client';

import { useEffect, useState } from 'react';
import TypingClassService from "@/services/typing-class-service";
import { Typography, List, ListItem } from '@mui/material';
import UserAvatarName from '@/app/(DashboardLayout)/components/shared/UserAvatarName';
import Loading from '@/app/loading';
import { StudentClassWithStudent } from '@/services/typing-class-service';

interface StudentsListProps {
  classId: string;
}

export default function StudentsList({ classId }: StudentsListProps) {
  const [students, setStudents] = useState<StudentClassWithStudent[]>([]);
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
            displayName={student.student_name}
            avatarUrl={student.student_avatar_url}
            size={36}
          />
        </ListItem>
      ))}
    </List>
  );
}
