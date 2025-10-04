"use client";
import { useState, useEffect } from "react";
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useMode } from "@/contexts/ModeContext";
import { MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getTypingClassesForStudent, getTypingClassesForTeacher } from "@/lib/typingClass";
import CreateTypingClass from "@/app/(DashboardLayout)/components/classes/CreateTypingClass";
import JoinTypingClass from "@/app/(DashboardLayout)/components/classes/JoinTypingClass";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");

  const isPracticeMode = (mode === "practice");
  const isClassroomMode = (mode === "classroom");
  const isGameMode = (mode === "game");

  const isTeacher = roles.includes('teacher');
  const isStudent = roles.includes('student');

  // Fetch classes for the current user
  useEffect(() => {
    if (!user) return;
    async function fetchClasses() {
      let data: TypingClass[] = [];
      if (isTeacher) {
        data = await getTypingClassesForTeacher(user!.id); 
      } else if (isStudent) {
        data = await getTypingClassesForStudent(user!.id); 
      }
      setClasses(data);
    }

    if (isClassroomMode) {
      fetchClasses();
    }
  }, [user, isClassroomMode, isTeacher, isStudent]);

  useEffect(() => {
  // check if we're on a /class/[id] route
  const match = pathname.match(/^\/class\/(\d+)/);
  if (match) {
    setSelectedClass(Number(match[1]));
  } else {
    setSelectedClass("");
  }
}, [pathname]);

  const handleSelectChange = (event: any) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    
    router.push(`/class/${classId}`);
  };

  return (
    <>
        {isClassroomMode && isTeacher && 
          <>
            {classes.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>My Classes</InputLabel>
                <Select value={selectedClass} label="My Classes" onChange={handleSelectChange} sx={{mr:1}}>
                    {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                        {cls.title}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            )}
            <CreateTypingClass/>
          </>
        }
        {isClassroomMode && isStudent && 
          <>
            {classes.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>My Classes</InputLabel>
                <Select value={selectedClass} label="My Classes" onChange={handleSelectChange} sx={{mr:1}}>
                    {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                        {cls.title}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            )}
            <JoinTypingClass/>
          </>
        }
    </>
  );
}
