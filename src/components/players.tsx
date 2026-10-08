import Matches from "@/components/matchesTable";
import { mockMatches } from "@/app/matches/page";

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
            <p className="text-2xl font-bold">{player.elo_s}</p>
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
