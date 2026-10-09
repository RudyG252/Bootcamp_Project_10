import Player, { playerInterface } from "@/database/schemas/playerSchema";

//  {
//     _id: mongoose.Types.ObjectId;
//     name: String;
//     elo_s: Number;
//     elo_d: Number;
//     matches: Schema.Types.ObjectId[];
//   }

export default function LeaderBoard(playerList: playerInterface[], isSingles: boolean) {
  return (
    <div className="bg-blue-200 align-middle items-center mt-12 max-w-250 mx-auto min-w-145">
      <div className="items-center">
        <h1 className="text-center text-4xl bg-blue-400 p-3 text-white font-bold">
          {isSingles ? "Singles " : "Doubles "}Leaderboard
        </h1>
      </div>
      <table className="bg-blue-50 w-full">
        <thead>
          <tr className="border-b-2 border-blue-200">
            <th className="">Rank</th>
            <th>Name</th>
            {isSingles ? <th>Elo S</th> : <th>Elo D</th>}
          </tr>
        </thead>
        <tbody className="align-middle items-center text-center">
          {[...playerList]
            .sort((a, b) => (isSingles ? b.elo_s - a.elo_s : b.elo_d - a.elo_d))
            .map((player: playerInterface, index: number) => (
              <tr key={player._id.toString()} className="hover:bg-blue-100">
                <td>{index + 1}</td>
                <td>{player.name}</td>
                {isSingles ? <td>{player.elo_s}</td> : <td>{player.elo_d}</td>}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
