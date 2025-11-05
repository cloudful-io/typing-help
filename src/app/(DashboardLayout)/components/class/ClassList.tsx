"use client";
import { useState, useEffect } from "react";
import { useUserRoles } from "@/contexts/UserRolesContext";
import { useMode } from "@/contexts/ModeContext";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Avatar,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import CreateTypingClass from "@/app/(DashboardLayout)/components/class/CreateTypingClass";
import JoinTypingClass from "@/app/(DashboardLayout)/components/class/JoinTypingClass";
import { useRouter, useParams } from "next/navigation";
import TypingClassService from "@/services/typing-class-service";
import { IconSchool } from "@tabler/icons-react";

interface TypingClass {
  id: number;
  title: string;
  code: string;
  teacher_name: string | null;
}

export default function ClassList() {
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();
  const { mode } = useMode();
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();

  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");

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
        //data = await TypingClassService.getTypingClassesForStudent(user!.id);
      }
      setClasses(data);
    }
    fetchClasses();

  }, [user, isTeacher, isStudent]);

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
    <Box sx={{ mt: 2 }}>
      {classes.length > 0 ? (
      <>
        <Grid container spacing={2}>
        {classes.map((cls) => (
            <Grid key={cls.id} size={{xs:12, sm: 6, md: 4}} >
            <Card
                  variant="outlined"
                  sx={{
                    height: "150px",
                    borderColor:
                      selectedClass === cls.id ? "primary.main" : "divider",
                    boxShadow: selectedClass === cls.id ? 4 : 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleClassClick(cls.id)}>
                    <CardHeader
                        title={
                            <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.getContrastText(
                                theme.palette.secondary.main
                                ),
                            }}
                            >
                            {cls.title}
                            </Typography>
                        }
                        subheader={
                            <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.getContrastText(
                                theme.palette.secondary.main
                                ),
                                opacity: 0.85,
                            }}
                            >
                            {cls.teacher_name ? `Teacher: ${cls.teacher_name}` : ""}
                            </Typography>
                        }
                        sx={{
                            backgroundColor: "secondary.main",
                            py: 1.5,
                            px: 2,
                        }}
                        />

                    <CardContent sx={{ pt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Code: {cls.code}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
            </Grid>
        ))}
        </Grid>
        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            mb: 2,
        }}
        > 
        {isTeacher ? <CreateTypingClass /> : <JoinTypingClass />}
        </Box>
      </>
      ) : (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 170px)",
          textAlign: "center",
          px: 2,
        }}
      >
        <IconSchool size={64} style={{ marginBottom: 16 }} />
        <Typography variant="h5" gutterBottom>
          {isTeacher
            ? "You have not created any classes yet."
            : "You have not joined any classes yet."}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {isTeacher
            ? "Start by creating a new class to invite your students."
            : "Join your class by entering a class code provided by your teacher."}
        </Typography>
        {isTeacher ? (
          <CreateTypingClass/>
        ) : (
          <JoinTypingClass/>
        )}
      </Box>
      )}
    </Box>
  );
}
