"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserRoles } from "@/contexts/UserRolesContext";
import TypingClassService from "@/services/typing-class-service";

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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function checkClasses() {
      let data: TypingClass[] = [];
      if (roles.includes("teacher")) {
        data = await TypingClassService.getTypingClassesForTeacher(user!.id);
      } else if (roles.includes("student")) {
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
    return <div>Loading...</div>;
  }

  if (!hasClass) {
    return <>Classroom Available Soon!</>;
  }

  return null; // redirect will happen if hasClass
}
