'use client';

import CreateTypingClass from "@/app/(DashboardLayout)/components/classes/CreateTypingClass"
import JoinTypingClass from "@/app/(DashboardLayout)/components/classes/JoinTypingClass"
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