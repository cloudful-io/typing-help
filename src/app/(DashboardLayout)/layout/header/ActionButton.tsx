"use client";
import { useState, useEffect } from "react";
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useMode } from "@/contexts/ModeContext";
import { Button, MenuItem, Select, FormControl, InputLabel,Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InputIcon from '@mui/icons-material/Input';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getTypingClassesForStudent, getTypingClassesForTeacher } from "@/lib/typingClass";
import CreateTypingClass from "@/app/(DashboardLayout)/components/classes/CreateTypingClass";
import JoinTypingClass from "@/app/(DashboardLayout)/components/classes/JoinTypingClass";

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

export default function ActionButton() {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const { mode } = useMode();
  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");

  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "join" | null>(null);

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

  const handleSelectChange = (event: any) => {
    setSelectedClass(event.target.value);
  };

  const handleOpenDialog = (mode: "create" | "join") => {
    setDialogMode(mode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDialogMode(null);
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
