import { playerInterface } from "@/database/schemas/playerSchema";

export default function LeaderBoard(playerList: playerInterface[], isSingles: boolean) {
  const format = isSingles ? "Singles" : "Doubles";

  return (
    <section className="min-w-0 w-full overflow-hidden rounded-xl bg-blue-200">
      <h1 className="bg-blue-400 p-3 text-center text-2xl font-bold text-white sm:text-3xl">{format} Leaderboard</h1>
      <div
        tabIndex={0}
        role="region"
        aria-label={`${format} rankings, scroll to view more`}
        className="max-h-[32rem] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      >
        <table className="w-full min-w-[28rem] bg-blue-50 text-center">
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 z-10 border-b-2 border-blue-200 bg-blue-50 px-4 py-2">
                Rank
              </th>
              <th scope="col" className="sticky top-0 z-10 border-b-2 border-blue-200 bg-blue-50 px-4 py-2">
                Name
              </th>
              <th scope="col" className="sticky top-0 z-10 border-b-2 border-blue-200 bg-blue-50 px-4 py-2">
                {isSingles ? "Elo S" : "Elo D"}
              </th>
            </tr>
          </thead>
          <tbody>
            {[...playerList]
              .sort((a, b) => (isSingles ? b.elo_s - a.elo_s : b.elo_d - a.elo_d))
              .map((player, index) => (
                <tr key={player._id.toString()} className="hover:bg-blue-100">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="whitespace-nowrap px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">{isSingles ? player.elo_s : player.elo_d}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
