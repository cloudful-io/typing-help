'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useClassContext } from '@/contexts/ClassContext';
import { getTypingClassById, isMember } from '@/lib/typingClass';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

interface ClassDetailProps {
  classId: string;
}

export default function ClassDetail({ classId }: ClassDetailProps) {
  const { setMode } = useMode();
  const { setActiveClass } = useClassContext();
  const { user } = useSupabaseAuth();

  const [classData, setClassData] = useState<TypingClass | null>(null);
  const [isUserMember, setIsUserMember] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    async function initClass() {
      if (!user) return;

      // Check if user is a member first
      const member = await isMember(user.id, classId);
      setIsUserMember(member);

      if (!member) return; // don't fetch class if not a member

      // Fetch the class
      const data = await getTypingClassById(classId);
      setClassData(data);

      // Sync context
      setActiveClass(data);

      // Set mode to classroom
      setMode('classroom');
    }

    initClass();
  }, [classId, setActiveClass, setMode, user]);

  if (isUserMember === null) return <p>Loading...</p>; // still checking membership
  if (!isUserMember) return <p>You are not a member of this class.</p>;
  if (!classData) return <p>Loading class data...</p>;

  return (
    <div>
      <h1>{classData.title}</h1>
      <p>Class code: {classData.code}</p>
      {/* Other class content, interactive components */}
    </div>
  );
}
