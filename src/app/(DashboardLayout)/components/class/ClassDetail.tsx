'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import { useEffect, useState } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useClassContext } from '@/contexts/ClassContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tab, Box } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ClassHeader from './ClassHeader';
import StudentsList from './StudentList';
import AssignmentList from './AssignmentList';
import TypingClassService from "@/services/typing-class-service";
import Loading from '@/app/loading';
import { TypingClassWithTeacher } from '@/services/typing-class-service';

interface ClassDetailProps {
  classId: string;
}

export default function ClassDetail({ classId }: ClassDetailProps) {
  const { setMode } = useMode();
  const { setActiveClass } = useClassContext();
  const { user } = useSupabaseAuth();

  const [classData, setClassData] = useState<TypingClassWithTeacher | null>(null);
  const [isUserMember, setIsUserMember] = useState<boolean | null>(null); 
  const [activeTab, setActiveTab] = useState("0"); // 0 = Practice, 1 = Students

  useEffect(() => {
    async function initClass() {
      if (!user) return;

      // Check if user is a member first
      const member = await TypingClassService.isMember(user.id, classId);
      setIsUserMember(member);

      if (!member) return; // don't fetch class if not a member

      // Fetch the class
      const data = await TypingClassService.getTypingClassById(classId);
      setClassData(data);

      // Sync context
      setActiveClass(data);

      // Set mode to classroom
      setMode('class');
    }

    initClass();
  }, [classId, setActiveClass, setMode, user]);

  if (isUserMember === null) return <Loading/>; 
  if (!isUserMember) return <p>You are not a member of this class.</p>;
  if (!classData) return <Loading/>;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <PageContainer title={classData.title} description={classData.title}>
        <Container sx={{ mt: 0 }}>
          <ClassHeader title={classData.title} code={classData.code} teacher_name={classData.teacher_name} teacher_avatar_url={classData.teacher_avatar_url}/>

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="Class Detail">
                  <Tab label="Assignments" value="0" />
                  <Tab label="Students" value="1" />
                </TabList>
              </Box>
              <TabPanel value="0">
                <Box>
                  {/* Render your Practice content here */}
                  <AssignmentList classId={classId}/>
                </Box>

              </TabPanel>
              <TabPanel value="1">
                <Box>
                  <StudentsList classId={classId} />
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </Container>
      </PageContainer>
    </>
  );
}
