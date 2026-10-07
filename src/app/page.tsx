import Navbar from "@/components/Navbar";
import LeaderBoard from "@/components/Leaderboard";
import { mockPlayers } from "./players/page";

export default function Home() {
  return (
    <main>
      {LeaderBoard(mockPlayers, true)}
      {LeaderBoard(mockPlayers, false)}
    </main>
  );
}
