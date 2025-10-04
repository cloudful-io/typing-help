'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useClassContext } from '@/contexts/ClassContext';
import { getTypingClassById } from '@/lib/typingClass';

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

interface ClassDetailProps {
  classId: number;
}

export default function ClassDetail({ classId }: ClassDetailProps) {
    const { setMode } = useMode();
    const { setActiveClass } = useClassContext();
    const [classData, setClassData] = useState<TypingClass | null>(null);

  useEffect(() => {
    async function initClass() {
      // Fetch the class
      const data = await getTypingClassById(classId.toString());
      setClassData(data);

      // Sync context
      setActiveClass(data);

      // Set mode to classroom when navigating directly to a class page
      setMode('classroom');
    }

    initClass();
  }, [classId, setActiveClass, setMode]);

  if (!classData) return <p>Loading class...</p>;

  return (
    <div>
      <h1>{classData.title}</h1>
      <p>Class code: {classData.code}</p>
      {/* Other class content, interactive components */}
    </div>
  );
}
