import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  email: text("email").notNull().unique(),
  elo: numeric("elo").notNull().default("1000"), // Add Elo rating field
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  player1_id: integer("player1_id") // Use snake_case
    .references(() => players.id)
    .notNull(),
  player2_id: integer("player2_id") // Use snake_case
    .references(() => players.id)
    .notNull(),
  player1_score: integer("player1_score").notNull(), // Use snake_case
  player2_score: integer("player2_score").notNull(), // Use snake_case
  player1_elo_change: numeric("player1_elo_change").notNull(),
  player2_elo_change: numeric("player2_elo_change").notNull(),
  player1_elo_after: numeric("player1_elo_after").notNull(),
  player2_elo_after: numeric("player2_elo_after").notNull(),
  played_at: timestamp("played_at").defaultNow().notNull(),
});
