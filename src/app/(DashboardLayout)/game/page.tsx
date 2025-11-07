import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import GameMode from '../components/game/GameMode';

export default async function GamePage() {
  return (
    <PageContainer title="Game Hub" description="This page allows you to practice your typing skills with mini-games that are developed by the community." showTitle>
      <GameMode/>
    </PageContainer>
  );
}