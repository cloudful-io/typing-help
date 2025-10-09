"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useMode } from "@/contexts/ModeContext";
import { useUserRoles } from "@/contexts/UserRolesContext";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import Image from "next/image";
import TermsOfUse from "@/app/(DashboardLayout)/components/shared/TermsOfUse";
import PrivacyPolicy from "@/app/(DashboardLayout)/components/shared/PrivacyPolicy";

const steps = ["Agreements", "Profile"];

export default function OnboardingPage() {
  const router = useRouter();
  const { setMode } = useMode();
  const { setRoles } = useUserRoles();
  
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Agreements
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Step 2: Profile
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);

  // Step navigation
  const [activeStep, setActiveStep] = useState(0);

  const canContinueStep1 = agreeTerms && agreePrivacy;
  const canContinueStep2 = selectedRole;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    if (user === null) {
      router.push("/?m=practice");
    }
  }, [user, router]);
  
  const handleSave = async () => {
    // Anonymous users
    if (!user) {
        // Redirect user to practice mode
        router.push("/?m=practice");
        return;
    }
    else if (!selectedRole) {
      setErrorMsg("Please select a role before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const userRoleRes = await fetch("/api/userRole", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            roleName: selectedRole
          }),
        });

        const userRole = await userRoleRes.json();

        if (!userRole) {
          setErrorMsg("Failed to add role to user. Please try again.");
          return;
        }

        const userRes = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name,
            onboardingComplete: true,
          }),
        });
        const userObject = await userRes.json();

        if (!userObject?.id) {
          throw new Error("Failed to get user ID from database");
        }
        setRoles([selectedRole]);
        setMode("classroom");

        // Redirect user to Classroom mode
        setTimeout(() => router.push("/m=classroom"), 0);
    } catch (error) {
        setErrorMsg("Failed to add role to user. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };
  
  if (user === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      //flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", position: "relative", top: "-10%" }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography align="center" sx={{ mb: 2 }}>
            Step {activeStep + 1} of {steps.length}
        </Typography>
        {/* Step Content */}
        {activeStep === 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Welcome to Typing.Help
            </Typography>
            <Typography variant="body1" gutterBottom>
              Before continuing, please review and accept the following:
            </Typography>

            <FormGroup>
                {/* Terms of Use */}
                <FormControlLabel
                control={
                    <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                }
                label={
                    <span>
                    I agree to the{" "}
                    <Link component="button" onClick={() => setShowTerms(true)}>
                        Terms of Use
                    </Link>
                    </span>
                }
                />
                {/* Privacy Policy */}
                <FormControlLabel
                control={
                    <Checkbox
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                    />
                }
                label={
                    <span>
                    I agree to the{" "}
                    <Link component="button" onClick={() => setShowPrivacy(true)}>
                        Privacy Policy
                    </Link>
                    </span>
                }
                />
            </FormGroup>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={!canContinueStep1}
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              Select Your Role
            </Typography>

            <Box display="flex" justifyContent="center" gap={3}>
              {/* Teacher Card */}
              <Paper
                elevation={selectedRole === "teacher" ? 6 : 3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 3,
                  width: 200,
                  border: selectedRole === "teacher" ? "3px solid" : "1px solid",
                  borderColor: selectedRole === "teacher" ? "primary.main" : "divider",
                  "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => setSelectedRole("teacher")}
              >
                <Box mb={2}>
                  <Image src="/images/icons/teacher.png" alt="Teacher" height={64} width={64} />
                </Box>
                <Typography variant="h6">Teacher</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create classes, manage students, and track progress.
                </Typography>
              </Paper>

              {/* Student Card */}
              <Paper
                elevation={selectedRole === "student" ? 6 : 3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 3,
                  width: 200,
                  border: selectedRole === "student" ? "3px solid" : "1px solid",
                  borderColor: selectedRole === "student" ? "primary.main" : "divider",
                  "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => setSelectedRole("student")}
              >
                <Box mb={2}>
                  <Image src="/images/icons/student.png" alt="Student" height={64} width={64} />
                </Box>
                <Typography variant="h6">Student</Typography>
                <Typography variant="body2" color="text.secondary">
                  Join classes, complete exercises, and improve your skills.
                </Typography>
              </Paper>
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
              <Button variant="outlined" disabled={isSaving} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!canContinueStep2 || isSaving}
                onClick={handleSave}
                >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : "Save Profile"}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Terms Dialog */}
      <Dialog
        open={showTerms}
        onClose={() => setShowTerms(false)}
        scroll="paper"
        maxWidth="sm"
        aria-labelledby="terms-title"
        fullWidth
      >
        <DialogTitle id="terms-title">Terms of Use</DialogTitle>
        <DialogContent dividers>
          <TermsOfUse/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTerms(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
            setAgreeTerms(true); // auto-check the box
            setShowTerms(false);
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        maxWidth="sm"
        aria-labelledby="privacy-title"
        fullWidth
      >
        <DialogTitle id="privacy-title">Privacy Policy</DialogTitle>
        <DialogContent dividers>
          <PrivacyPolicy/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacy(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
            setAgreePrivacy(true); // auto-check the box
            setShowPrivacy(false);
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
        >
        <Alert severity="error" onClose={() => setErrorMsg("")}>
            {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
