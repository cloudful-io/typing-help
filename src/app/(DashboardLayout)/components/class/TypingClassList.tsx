"use client";

import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { getTypingClassesForTeacher, getTypingClassesForStudent } from "@/lib/typingClass";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserRoles } from "@/contexts/UserRolesContext";

interface TypingClass {
  id: number;
  title: string;
  code: string;
  teacher_id: string;
}

export default function TypingClassList() {
  const { user } = useSupabaseAuth();
  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"teacher" | "student" | null>(null);
  //setRole(useUserRoles());
  useEffect(() => {
    const fetchRoleAndClasses = async () => {
      if (!user) return;

      // 1. Get the user's roles from your userRole lib
      //const { roles } = useUserRoles();
      //const isTeacher = roles.includes("teacher");
      const isTeacher = true;
      //const isStudent = roles.includes("student");

      // Decide which role to use
      let userRole: "teacher" | "student" = "student"; // default
      if (isTeacher) userRole = "teacher";
      setRole(userRole);

      // 2. Fetch classes based on role
      let data: TypingClass[] = [];
      if (userRole === "teacher") {
        data = await getTypingClassesForTeacher(user.id);
      } else if (userRole === "student") {
        data = await getTypingClassesForStudent(user.id);
      }

      setClasses(data);
      setLoading(false);
    };

    fetchRoleAndClasses();
  }, [user]);

  if (loading) {
    return <Typography>Loading classes...</Typography>;
  }

  if (classes.length === 0) {
    return (
      <Typography>
        {role === "teacher"
          ? "You have not created any classes yet."
          : "You have not joined any classes yet."}
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {role === "teacher" ? "My Classes" : "Joined Classes"}
      </Typography>
      <List>
        {classes.map((cls) => (
          <ListItem key={cls.id}>
            <ListItemText
              primary={cls.title}
              secondary={`Code: ${cls.code}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
