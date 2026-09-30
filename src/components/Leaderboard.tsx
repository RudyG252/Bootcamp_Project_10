import Player from "@/database/schemas/playerSchema";
import { InferSchemaType } from "mongoose";

export default function LeaderBoard(playerList: InferSchemaType<typeof Player>[]) {
  return <div>{playerList[0].name}</div>;
}
