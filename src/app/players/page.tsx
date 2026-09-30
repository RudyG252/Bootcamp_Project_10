import LeaderBoard from "@/components/Leaderboard";

const mockPlayers = [
  {
    _id: "1",
    name: "BobBad",
    elo_s: 200,
    elo_d: 400,
  },
  {
    _id: "2",
    name: "BobGood",
    elo_s: 700,
    elo_d: 800,
  },
  {
    _id: "3",
    name: "BobMid",
    elo_s: 500,
    elo_d: 600,
  },
];

export default function Players() {
  return (
    <div>
      <h1>Players page coming soon</h1>
      <LeaderBoard />
    </div>
  );
}
