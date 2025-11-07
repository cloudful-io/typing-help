import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Container, Divider } from "@mui/material";
import TermsOfUse from "../components/shared/TermsOfUse";
import { Typography } from "@mui/material";

export default function TermsOfUsePage() {
  return (
    <PageContainer title="Terms of Use" description="Typing Help: Terms of Use" showTitle>
      <Container>
        <TermsOfUse/>
      </Container>
    </PageContainer>
  );
}