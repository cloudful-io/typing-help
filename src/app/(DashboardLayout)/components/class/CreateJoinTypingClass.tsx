'use client';

import CreateTypingClass from "@/app/(DashboardLayout)/components/class/CreateTypingClass"
import JoinTypingClass from "@/app/(DashboardLayout)/components/class/JoinTypingClass"
import { useUserRoles } from "@/contexts/UserRolesContext";

export default function CreateJoinTypingClass() {
  const { roles } = useUserRoles();

  const isTeacher = roles.includes('teacher');
  const isStudent = roles.includes('student');
    
  return (
    <>
        {isTeacher && <CreateTypingClass />}
        {isStudent && <JoinTypingClass />}
  </>
  );
}