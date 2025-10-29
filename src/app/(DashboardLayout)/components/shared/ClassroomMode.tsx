"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserRoles } from "@/contexts/UserRolesContext";
import TypingClassService from "@/services/typing-class-service";
import { Box, Typography, Button } from "@mui/material";
import Loading from "@/app/loading";
import JoinTypingClass from "@/app/(DashboardLayout)/components/class/JoinTypingClass";
import CreateTypingClass from "@/app/(DashboardLayout)/components/class/CreateTypingClass";
import { IconSchool } from "@tabler/icons-react";

interface TypingClass {
  id: number;
  title: string;
  code: string;
}

export default function ClassroomMode() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const { roles } = useUserRoles();

  const [loading, setLoading] = useState(true);
  const [hasClass, setHasClass] = useState(false);

  const isTeacher = roles.includes("teacher");
  const isStudent = roles.includes("student");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function checkClasses() {
      let data: TypingClass[] = [];
      if (isTeacher) {
        data = await TypingClassService.getTypingClassesForTeacher(user!.id);
      } else if (isStudent) {
        data = await TypingClassService.getTypingClassesForStudent(user!.id);
      }

      if (data.length > 0) {
        setHasClass(true);
        router.replace(`/class/${data[0].id}`); // redirect to first class
      } else {
        setHasClass(false);
      }

      setLoading(false);
    }

    checkClasses();
  }, [user, roles, router]);

  if (loading) {
    return <Loading/>;
  }

  if (!hasClass) {
    return (
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
            ? "You haven’t created any classes yet."
            : "You haven’t joined any classes yet."}
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
    );
  }

  return null; // redirect will happen if hasClass
}
