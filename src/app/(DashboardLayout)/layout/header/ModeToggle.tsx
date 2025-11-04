"use client";

import { ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import { useMode } from "@/contexts/ModeContext";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useRouter } from "next/navigation";

export default function ModeToggle() {
  const { mode, setMode } = useMode();
  const router = useRouter();
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down("md")); // true if screen < sm

  const commonStyles = {
    "&.Mui-selected": {
      backgroundColor: "success.dark",
      color: "white",
      p: 2,
      "&:hover": {
        backgroundColor: "success.main",
      },
    },
  };
  
  return (
    <ToggleButtonGroup
      value={mode}
      color="primary"
      exclusive
      onChange={(_, newMode) => {
        if (newMode) 
          setMode(newMode);
            
        router.push(`/${encodeURIComponent(newMode)}`);
      }}
      size="small"
    >
      <ToggleButton value="practice" sx={commonStyles} aria-label="Practice Mode">
        <KeyboardIcon sx={{ mr: 1 }} />
        Practice
      </ToggleButton>
      <ToggleButton value="class" sx={commonStyles} aria-label="Classroom Mode">
        <SchoolIcon sx={{ mr: 1 }} />
        Classroom
      </ToggleButton>
      <ToggleButton value="game" sx={commonStyles} aria-label="Game Mode">
        <SportsEsportsIcon sx={{ mr: 1 }} />
        Game
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
