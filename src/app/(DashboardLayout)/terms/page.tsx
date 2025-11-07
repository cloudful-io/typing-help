import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import TermsOfUse from "../components/shared/TermsOfUse";

export default function TermsOfUsePage() {
  return (
    <PageContainer title="Terms of Use" description="Typing Help: Terms of Use" showTitle>
      <TermsOfUse/>
    </PageContainer>
  );
}