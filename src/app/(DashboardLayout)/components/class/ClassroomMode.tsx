"use client";

import { useEffect } from "react";
import ClassList from "../class/ClassList";
import { useMode } from '@/contexts/ModeContext';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";

export default function ClassroomMode() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("class");
  }, [setMode]);

  return (
    <PageContainer title="My Classes" description="This page provides teachers and students a way to create or join a class." showTitle>
      <Container>
        <ClassList/>
      </Container>
    </PageContainer>
  );
}
