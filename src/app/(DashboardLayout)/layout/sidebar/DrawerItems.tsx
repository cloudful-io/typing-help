"use client";
import { useState, useEffect } from "react";
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useMode } from "@/contexts/ModeContext";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import CreateTypingClass from "@/app/(DashboardLayout)/components/class/CreateTypingClass";
import JoinTypingClass from "@/app/(DashboardLayout)/components/class/JoinTypingClass";
import { useRouter, useParams } from "next/navigation";
import TypingClassService from "@/services/typing-class-service";

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

export default function DrawerItems() {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const { mode } = useMode();
  const router = useRouter();
  const params = useParams();

  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");
  const [expanded, setExpanded] = useState<boolean>(true);

  const isClassroomMode = mode === "classroom";
  const isTeacher = roles.includes("teacher");
  const isStudent = roles.includes("student");

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

  // Sync selected class from URL params
  useEffect(() => {
    const id = params?.id ? Number(params.id) : "";
    setSelectedClass(id);
  }, [params]);

  const handleClassClick = (classId: number) => {
    setSelectedClass(classId);
    router.push(`/class/${classId}`);
  };

  return (
    <>
      {isClassroomMode && (
        <Box sx={{ mt: 1 }}>
          {classes.length > 0 && (
            <Accordion
              expanded={expanded}
              onChange={() => setExpanded(!expanded)}
              sx={{
                width: "100%",
                mx: 1,
                borderRadius: 2,
                boxShadow: "none",
                "&:before": { display: "none" },
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  My Classes
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List>
                  {classes.map((cls) => (
                    <ListItemButton
                      key={cls.id}
                      selected={selectedClass === cls.id}
                      onClick={() => handleClassClick(cls.id)}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        "&.Mui-selected": {
                          backgroundColor: "action.selected",
                        },
                      }}
                    >
                      <ListItemText primary={cls.title} />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {isTeacher && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <CreateTypingClass />
            </Box>
          )}

          {isStudent && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <JoinTypingClass />
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
