import Matches from "@/components/matchesTable";
import { mockMatches } from "@/app/matches/page";

interface Player {
  name: string;
  elo_s: number;
  elo_d: number;
}

const player: Player = {
  name: "John Doe",
  elo_s: 1500,
  elo_d: 1400,
};

export default function Players() {
  return (
    <div>
      <div>
        <p>Future search bar</p>
      </div>

      <div>
        <h1>{player.name}</h1>

        <div>
          <div>
            <p>Singles ELO</p>
            <p>{player.elo_s}</p>
          </div>

          <div>
            <p>Doubles ELO</p>
            <p>{player.elo_d}</p>
          </div>
        </div>
      </div>

      <Matches matches={mockMatches} playerName={player.name} />
    </div>
  );
}
