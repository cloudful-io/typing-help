"use client"
import { Box, Button, Grid, Typography, Card, CardContent, Avatar, Stack } from "@mui/material";
import {useTheme} from '@mui/material';

const features = [
  {
    title: "Gamified Practice",
    description: "Level up your typing skills with engaging mini-games.",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your speed, accuracy, and improvements over time.",
  },
  {
    title: "Competitive Leaderboard",
    description: "Compete with friends and see where you rank globally.",
  },
  {
    title: "Flexible Practice Modes",
    description: "From daily warm-ups to challenging speed tests—practice your way.",
  },
];

export default function AboutPage() {
  const theme = useTheme();
  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          width: "100%",
          py: 12,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: 'url("/images/background/hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor:
                theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.6)" // darker overlay for dark mode
                : "rgba(255,255,255,0.5)", // lighter overlay for light mode
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600 }}>
          <Typography variant="h1" gutterBottom>
            Learning Through Practice, Classes, and Fun.
          </Typography>
          <Typography variant="h4" gutterBottom>
            Master your typing skills through fun, interactive exercises. Track your progress, challenge friends, and reach your personal best.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="contained" size="large" color="primary" href="/practice">Start Practicing</Button>
            {/*<Button variant="outlined" size="large" >See a Demo</Button>*/}
          </Stack>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6, px: 2,  }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Use Typing Help
        </Typography>
        <Grid container spacing={4} sx={{ mt: 3 }}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{xs:12, sm:6, lg:3}}>
              <Card sx={{ width: "100%", height: "100%", textAlign: "center", p: 2 }}>
                <Avatar sx={{ mx: "auto", mb: 2 }}>{feature.title[0]}</Avatar>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                  <Typography variant="body2">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};