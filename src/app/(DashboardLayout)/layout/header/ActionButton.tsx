"use client";
import { useState, useEffect } from "react";
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useMode } from "@/contexts/ModeContext";
import { MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import CreateTypingClass from "@/app/(DashboardLayout)/components/class/CreateTypingClass";
import JoinTypingClass from "@/app/(DashboardLayout)/components/class/JoinTypingClass";
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import TypingClassService from "@/services/typing-class-service";

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

export default function ActionButton() {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const { mode } = useMode();
  const router = useRouter();
  const params = useParams();

  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");

  const isPracticeMode = (mode === "practice");
  const isClassroomMode = (mode === "class");
  const isGameMode = (mode === "game");

  const isTeacher = roles.includes('teacher');
  const isStudent = roles.includes('student');

  // Fetch classes for the current user
  useEffect(() => {
    if (!user) return;
    async function fetchClasses() {
      let data: TypingClass[] = [];
      if (isTeacher) {
        data = await TypingClassService.getTypingClassesForTeacher(user!.id);
      } else if (isStudent) {
        data = await TypingClassService.getTypingClassesForStudent(user!.id);
      }
      setClasses(data);
    }

    if (isClassroomMode) {
      fetchClasses();
    }
  }, [user, isClassroomMode, isTeacher, isStudent]);
  
  useEffect(() => {
    const id = params?.id ? Number(params.id) : "";
    setSelectedClass(id);
  }, [params]);


  const handleSelectChange = (event: any) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    
    router.push(`/class/${classId}`);
  };

  return (
    <>
        {isClassroomMode && (
        <>
          {classes.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 200, mr: 1 }}>
              <InputLabel>My Classes</InputLabel>
              <Select value={selectedClass} label="My Classes" onChange={handleSelectChange}>
                {classes.map(cls => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {isTeacher && <CreateTypingClass />}
          {isStudent && <JoinTypingClass />}
        </>
      )}
    </>
  );
}
