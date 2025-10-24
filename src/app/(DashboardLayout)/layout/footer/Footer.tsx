"use client";
import { useState } from "react";
import { useMode } from "@/contexts/ModeContext";
import { Box, ToggleButton, ToggleButtonGroup, Link, Stack, Typography} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function Footer() {
  const { mode, setMode } = useMode();
  const { user } = useSupabaseAuth();
  const router = useRouter();

  const footerLinks = [
    { label: "Updates", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "background.paper",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        justifyContent: "center",
        alignItems: "center",
        py: 1,
        zIndex: 1200, 
      }}
    >
      <Stack 
        direction="column"
        alignItems="center" // Center horizontally within the footer
        width="100%" // Ensure it spans the full width
        spacing={1} // Add a small vertical space between the mode toggles and links
      >
      {user && (
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode) 
              setMode(newMode);
                
            router.push(`/?m=${encodeURIComponent(newMode)}`);
          }}
          size="small"
          color="primary"
        >
          <ToggleButton value="practice">
            <PsychologyIcon sx={{ mr: 0.5 }} aria-label="Practice Mode"/> Practice Mode
          </ToggleButton>
          <ToggleButton value="classroom">
            <SchoolIcon sx={{ mr: 0.5 }} aria-label="Classroom Mode"/> Classroom Mode
          </ToggleButton>
          <ToggleButton value="game">
            <SportsEsportsIcon sx={{ mr: 0.5 }} aria-label="Game Mode"/> Game Mode
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          sx={{mt:1, mb:1}}
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              underline="hover"
              color="text.secondary"
              sx={{
                fontSize: "0.8rem",
                "&:hover": { color: "primary.main" },
              }}
            >
              {link.label}
            </Link>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
