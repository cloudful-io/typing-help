import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import PrivacyPolicy from "../components/shared/PrivacyPolicy";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer title="Privacy Policy" description="Typing Help: Privacy Policy" showTitle>
      <PrivacyPolicy/>
    </PageContainer>
  );
}