"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowUpDown, Trophy, TableIcon as TableTennis } from "lucide-react";
import { format } from "date-fns";
import { api } from "../app/libs/api";
import { useRouter } from "next/navigation";
import { MatchWithPlayerNames, TPlayer } from "../app/api/[[...slugs]]/route";

export function Pingis({
  players,
  matches,
}: {
  players: TPlayer[] | null;
  matches: MatchWithPlayerNames[] | null;
}) {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.matches.post({
        player1Name: player1,
        player2Name: player2,
        player1Score: parseInt(score1),
        player2Score: parseInt(score2),
      });

      // Clear form
      setPlayer1("");
      setPlayer2("");
      setScore1("");
      setScore2("");

      router.refresh();
    } catch (error) {
      console.error("Error submitting match:", error);
    }
  };

  return (
    <div className=" pt-7">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 ">pingis</h1>
        </header>

        <div className="flex flex-col items-center gap-12 mb-12 w-1/2 mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TableTennis className="mr-3" />
                Register match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={player1}
                    onValueChange={(value) => setPlayer1(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Player 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {players?.map((player) => (
                        <SelectItem
                          key={player.id}
                          value={player.name}
                          disabled={player.name === player2}
                        >
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={player2}
                    onValueChange={(value) => setPlayer2(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Player 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {players?.map((player) => (
                        <SelectItem
                          key={player.id}
                          value={player.name}
                          disabled={player.name === player1}
                        >
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Score 1"
                    type="number"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Score 2"
                    type="number"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700"
                >
                  Submit Match
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-3" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right text-green-600">
                      W
                    </TableHead>
                    <TableHead className="text-right text-red-600">L</TableHead>
                    <TableHead className="text-right">Win%</TableHead>
                    <TableHead className="text-right">Elo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players
                    ?.sort((a, b) => Number(b.elo) - Number(a.elo))
                    .slice(0, 8)
                    .map((player, index) => {
                      const playerMatches =
                        matches?.filter(
                          (m) =>
                            m.player1 === player.name ||
                            m.player2.name === player.name,
                        ) || [];

                      const wins = playerMatches.filter(
                        (m) =>
                          (m.player1 === player.name &&
                            m.player1_score > m.player2_score) ||
                          (m.player2.name === player.name &&
                            m.player2_score > m.player1_score),
                      ).length;

                      const losses = playerMatches.length - wins;
                      const winPercentage =
                        playerMatches.length > 0
                          ? ((wins / playerMatches.length) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell className="text-right">{wins}</TableCell>
                          <TableCell className="text-right">{losses}</TableCell>
                          <TableCell className="text-right">
                            {winPercentage}%
                          </TableCell>
                          <TableCell className="text-right">
                            {player.elo}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpDown className="mr-3" />
                Latest matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches
                    ?.sort(
                      (a, b) =>
                        new Date(b.played_at).getTime() -
                        new Date(a.played_at).getTime(),
                    )
                    .slice(0, 10)
                    .map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          {format(new Date(match.played_at), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              match.player1_elo_change.startsWith("-")
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            (
                            {match.player1_elo_change.startsWith("-")
                              ? "-"
                              : "+"}
                            {match.player1_elo_change})
                          </span>
                          <span className="mx-2">{match.player1}</span>
                          vs
                          <span className="mx-2">{match.player2.name}</span>
                          <span
                            className={
                              match.player2_elo_change.startsWith("-")
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            ({match.player2_elo_change})
                          </span>
                        </TableCell>
                        <TableCell>
                          {match.player1_score} - {match.player2_score}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
