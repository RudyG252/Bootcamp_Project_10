import Player, { playerInterface } from "@/database/schemas/playerSchema";

//  {
//     _id: mongoose.Types.ObjectId;
//     name: String;
//     elo_s: Number;
//     elo_d: Number;
//     matches: Schema.Types.ObjectId[];
//   }

export default function LeaderBoard(playerList: playerInterface[], inSingles: boolean) {
  return (
    <div className="">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Elo S</th>
            <th>Elo D</th>
          </tr>
        </thead>
        <tbody className="">
          {[...playerList]
            .sort((a, b) => b.elo_d - a.elo_d)
            .map((player: playerInterface, index: number) => (
              <tr key={player._id.toString()}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.elo_s}</td>
                <td>{player.elo_d}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
