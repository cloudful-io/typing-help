import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Practice from '../components/practice/Practice';

export default async function PracticePage() {
  return (
    <PageContainer title="⌨️ Practice" description="This page allows you to practice your typing skills with various texts and track your performance." showTitle>
      <Practice/>
    </PageContainer>
  );
}