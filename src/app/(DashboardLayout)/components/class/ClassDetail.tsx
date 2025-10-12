'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useClassContext } from '@/contexts/ClassContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tab, Box, Typography } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ClassHeader from './ClassHeader';
import StudentsList from './StudentList';
import TypingClassService from "@/services/typing-class-service";

interface TypingClass {
  id: number;
  title: string;
  code: string;
  teacherName: string;
}

interface ClassDetailProps {
  classId: string;
}

export default function ClassDetail({ classId }: ClassDetailProps) {
  const { setMode } = useMode();
  const { setActiveClass } = useClassContext();
  const { user } = useSupabaseAuth();

  const [classData, setClassData] = useState<TypingClass | null>(null);
  const [isUserMember, setIsUserMember] = useState<boolean | null>(null); 
  const [activeTab, setActiveTab] = useState("0"); // 0 = Practice, 1 = Students

  useEffect(() => {
    async function initClass() {
      if (!user) return;

      // Check if user is a member first
      // WY: const member = await isMember(user.id, classId);
      const member = await TypingClassService.isMember(user.id, classId);
      setIsUserMember(member);

      if (!member) return; // don't fetch class if not a member

      // Fetch the class
      // WY: const data = await getTypingClassById(classId);
      const data = await TypingClassService.getTypingClassById(classId);
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <ClassHeader title={classData.title} code={classData.code} teacher={classData.teacherName}/>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Practice" value="0" />
              <Tab label="Students" value="1" />
            </TabList>
          </Box>
          <TabPanel value="0">
            <Box>
              {/* Render your Practice content here */}
              <Typography>Practice assignments will go here.</Typography>
            </Box>

          </TabPanel>
          <TabPanel value="1">
            <Box>
              <StudentsList classId={classId} />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
