const mockMatches = [
  {
    _id: "match1",
    format: "singles",

    team1: [
      {
        player: {
          _id: "player1",
          name: "Rudy",
          elo: 1216,
        },
        eloBefore: 1200,
        eloChange: 16,
        eloAfter: 1216,
      },
    ],

    team2: [
      {
        player: {
          _id: "player2",
          name: "Simon",
          elo: 1164,
        },
        eloBefore: 1180,
        eloChange: -16,
        eloAfter: 1164,
      },
    ],

    winner: "team1",
    status: "completed",
  },

  {
    _id: "match2",
    format: "doubles",

    team1: [
      {
        player: {
          _id: "player1",
          name: "Rudy",
          elo: 1198,
        },
        eloBefore: 1216,
        eloChange: -18,
        eloAfter: 1198,
      },
      {
        player: {
          _id: "player3",
          name: "Noah",
          elo: 1082,
        },
        eloBefore: 1100,
        eloChange: -18,
        eloAfter: 1082,
      },
    ],

    team2: [
      {
        player: {
          _id: "player2",
          name: "Simon",
          elo: 1182,
        },
        eloBefore: 1164,
        eloChange: 18,
        eloAfter: 1182,
      },
      {
        player: {
          _id: "player4",
          name: "Ryan",
          elo: 1268,
        },
        eloBefore: 1250,
        eloChange: 18,
        eloAfter: 1268,
      },
    ],

    winner: "team2",
    status: "completed",
  },

  {
    _id: "match3",
    format: "singles",

    team1: [
      {
        player: {
          _id: "player3",
          name: "Noah",
          elo: 1082,
        },
      },
    ],

    team2: [
      {
        player: {
          _id: "player4",
          name: "Ryan",
          elo: 1268,
        },
      },
    ],

    status: "queued",
  },
];

export default function Matches() {
  return <h1>Matches page coming soon</h1>;
}
