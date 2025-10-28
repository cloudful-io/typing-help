"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMode } from "@/contexts/ModeContext";
import { useUserRoles } from "@/contexts/UserRolesContext";
import Loading from "@/app/loading";

export default function Logout() {
  const router = useRouter();
  const { setMode } = useMode();
  const { setRoles } = useUserRoles();

  useEffect(() => {
    // Reset mode and role
    setMode("practice"); 
    setRoles([]);

    const timer = setTimeout(() => {
      router.replace("/"); 
    }, 300);

    return () => clearTimeout(timer);
  }, [router, setMode, setRoles]);

  return <Loading/>; 
}
