import { Pingis } from "../components/pingis";
import { api } from "./libs/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pingis",
  description: "Reges Development & Operations AB.",
};

export default async function Page() {
  const { data: players } = await api.players.get();
  const { data: matches } = await api.matches.get();

  return (
    <div className=" min-h-screen font-geist-sans">
      <Pingis players={players} matches={matches} />
    </div>
  );
}
