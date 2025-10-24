import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container } from "@mui/material";
import PrivacyPolicy from "../components/shared/PrivacyPolicy";
import { Typography } from "@mui/material";

export default function PrivacyPolicyPage() {
    return (
      <>
        <PageContainer title="Privacy Policy" description="Typing Help: Privacy Policy">
            <Container sx={{ mt: 0 }}>
            <Typography variant="h2" sx={{mb:2}}>Privacy Policy</Typography>
            <PrivacyPolicy/>
            </Container>
        </PageContainer>
      </>
  );
}