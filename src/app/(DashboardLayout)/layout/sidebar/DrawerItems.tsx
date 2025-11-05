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
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import CreateTypingClass from "@/app/(DashboardLayout)/components/class/CreateTypingClass";
import JoinTypingClass from "@/app/(DashboardLayout)/components/class/JoinTypingClass";
import { useRouter, useParams } from "next/navigation";
import TypingClassService from "@/services/typing-class-service";
import { TypingClassWithTeacher } from "@/services/typing-class-service";

export default function DrawerItems({ onItemClick }: { onItemClick?: () => void }) {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const { mode } = useMode();
  const router = useRouter();
  const params = useParams();

  const [classes, setClasses] = useState<TypingClassWithTeacher[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");
  const [expanded, setExpanded] = useState<boolean>(true);

  const isClassroomMode = mode === "class";
  const isTeacher = roles.includes("teacher");
  const isStudent = roles.includes("student");

  // Fetch classes for the current user
  useEffect(() => {
    if (!user) return;
    async function fetchClasses() {
      let data: TypingClassWithTeacher[] = [];
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
              disableGutters
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'action.hover', // MUI theme-aware hover color
                }}
              >
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
                      onClick={() => {
                        onItemClick && onItemClick();
                        handleClassClick(cls.id);
                      }}
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
          {classes.length == 0 && (
            <Typography 
              sx={{display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              You do not have any classes assigned yet.
            </Typography>
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
