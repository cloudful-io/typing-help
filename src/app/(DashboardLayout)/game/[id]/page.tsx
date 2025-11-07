"use client";

import { useParams } from "next/navigation";
import { games } from "@/app/(DashboardLayout)/components/game/GameRegistry";
import { GameRunner } from "@/app/(DashboardLayout)/components/game/GameRunner";

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = games.find((g) => g.id === gameId);

  if (!game) return <p>Game not found</p>;

  return <GameRunner game={game} userId="demo-user" />;
}
