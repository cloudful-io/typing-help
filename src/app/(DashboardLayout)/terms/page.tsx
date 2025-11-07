import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container, Divider } from "@mui/material";
import TermsOfUse from "../components/shared/TermsOfUse";
import { Typography } from "@mui/material";

export default function TermsOfUsePage() {
    return (
      <>
        <PageContainer title="Terms of Use" description="Typing Help: Terms of Use">
          <Container sx={{ mt: 0 }}>
            <Typography variant="h2" sx={{mb:2}}>Terms of Use</Typography>
            <Divider sx={{ my: 2 }} />
            <TermsOfUse/>
          </Container>
        </PageContainer>
      </>
    );
}