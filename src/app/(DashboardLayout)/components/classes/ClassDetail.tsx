'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useClassContext } from '@/contexts/ClassContext';
import { getTypingClassById, isMember } from '@/lib/typingClass';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Divider, Typography, Box, Chip } from '@mui/material';

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

interface ClassDetailProps {
  id: string;
}

export default function ClassDetail({ id }: ClassDetailProps) {
  const { setMode } = useMode();
  const { setActiveClass } = useClassContext();
  const { user } = useSupabaseAuth();

  const [classData, setClassData] = useState<TypingClass | null>(null);
  const [isUserMember, setIsUserMember] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    async function initClass() {
      if (!user) return;

      // Check if user is a member first
      const member = await isMember(user.id, id);
      setIsUserMember(member);

      if (!member) return; // don't fetch class if not a member

      // Fetch the class
      const data = await getTypingClassById(id);
      setClassData(data);

      // Sync context
      setActiveClass(data);

      // Set mode to classroom
      setMode('classroom');
    }

    initClass();
  }, [id, setActiveClass, setMode, user]);

  if (isUserMember === null) return <p>Loading...</p>; // still checking membership
  if (!isUserMember) return <p>You are not a member of this class.</p>;
  if (!classData) return <p>Loading class data...</p>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h2" sx={{ fontWeight: 700 }}>
        {classData.title}
      </Typography>
      <Chip 
        label={`Class Code: ${classData.code}`} 
        color="primary" 
        variant="outlined" 
        sx={{ fontSize: "1rem", fontWeight: 600, px: 1.5 }}
      />
    </Box>

    {/* other content */}
    <Divider sx={{ my: 2 }} />

    </>
  );
}
