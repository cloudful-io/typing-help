"use client";
import { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";

export default function ModeBanner() {
  const [mode, setMode] = useState("Practice");

  const handleChange = (
  _event: React.MouseEvent<HTMLElement>,
  newMode: string | null
) => {
  if (newMode !== null) {
    setMode(newMode);
  }
};

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "background.paper",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 1,
        zIndex: 1200, // stays above other elements
      }}
    >
     

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        size="small"
        color="primary"
      >
        <ToggleButton value="Practice">
          <PsychologyIcon sx={{ mr: 0.5 }} /> Practice Mode
        </ToggleButton>
        <ToggleButton value="Classroom">
          <SchoolIcon sx={{ mr: 0.5 }} /> Classroom Mode
        </ToggleButton>
        <ToggleButton value="Game">
          <SportsEsportsIcon sx={{ mr: 0.5 }} /> Game Mode
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
