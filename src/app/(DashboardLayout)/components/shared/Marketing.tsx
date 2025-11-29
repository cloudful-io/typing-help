"use client";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { IconKeyboard } from '@tabler/icons-react';
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TypingTest from "./TypingTest";
import AppStatsCounter from "./AppStats";

const features = [
  {
    title: "Classroom Management",
    description: "Monitor students' progress and tailor to their specific needs.",
    icon: <SchoolOutlinedIcon color="secondary" sx={{ fontSize: 60 }} />,
  },
  {
    title: "Competitive Practice",
    description: "Level up your typing skills with engaging mini-games.",
    icon: <SportsEsportsOutlinedIcon color="secondary" sx={{ fontSize: 60 }} />,
  },
  {
    title: "Progress Tracking",
    description: "Monitor your speed, accuracy, and improvements over time.",
    icon: <AutoGraphOutlinedIcon color="secondary" sx={{ fontSize: 60 }} />,
  },
  {
    title: "Gaming Leaderboard",
    description: "Compete with friends and see where you rank.",
    icon: <LeaderboardOutlinedIcon color="secondary" sx={{ fontSize: 60 }} />,
  },
];

export default function Marketing() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        flexDirection: "column",
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 6 },
      }}
    >
      {/* Hero Section */}
      <Grid container spacing={4} alignItems="center">
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconKeyboard
                  color={theme.palette.secondary.main}
                  width="20"
                  height="20"
                  style={{ marginRight: 8 }}
                />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Learn Typing the Modern and Engaging Way.
              </Typography>
            </Box>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                mb: 1,
              }}
            >
              Practice.
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                mb: 1,
              }}
            >
              Learn.
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              color="primary"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                mb: 3,
              }}
            >
              Have Fun.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.2,
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                color: theme.palette.text.secondary,
              }}
            >
              Typing Help combines structured learning, fun mini-games, 
              progress tracking, and a competitive leaderboard to help you master typing in the most engaging way possible.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" size="large" href="/practice">
                Start Practicing
              </Button>
              <Button variant="outlined" size="large" href="/game">
                Play a Game
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Column - Media */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TypingTest />
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Use Typing Help
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                {feature.icon}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

        </Grid>
      </Box>
      <Grid size={{xs: 12}}>
        <AppStatsCounter />
      </Grid>
    </Box>
  );
}
