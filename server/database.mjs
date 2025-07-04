import Database from "better-sqlite3";
import { Card, Game, Round, User } from "./models.mjs";

const db = new Database("database.sqlite");
db.pragma("journal_mode = WAL");

/** CARD **/

export const listCards = () => {
  const sql = "SELECT * FROM card ORDER BY RANDOM()";
  const rows = db.prepare(sql).all();
  return rows.map(
    (row) => new Card(row.id, row.name, row.image, row.misfortune)
  );
};

export const getCard = (id) => {
  const sql = "SELECT * FROM card WHERE id = ?";
  const row = db.prepare(sql).get(id);
  if (!row) return null;
  return new Card(row.id, row.name, row.image, row.misfortune);
};

/** GAME **/

export const listGames = (userId) => {
  const sql = `
    SELECT
      game.id AS gameId,
      game.userId,
      game.createdAt AS gameCreatedAt,
      game.outcome AS gameOutcome,
      round.id AS roundId,
      round.createdAt AS roundCreatedAt,
      round.number AS roundNumber,
      round.outcome AS roundOutcome,
      card.id AS cardId,
      card.name AS cardName,
      card.image AS cardImage,
      card.misfortune AS cardMisfortune
    FROM game
    JOIN round ON round.gameId = game.id
    JOIN card ON round.cardId = card.id
    WHERE game.userId = ?
    ORDER BY game.createdAt DESC, round.number ASC
  `;
  const rows = db.prepare(sql).all(userId);
  const games = rows.reduce((games, row) => {
    let game = games.get(row.gameId);
    if (!game) {
      game = new Game(
        row.gameId,
        row.userId,
        row.gameCreatedAt,
        row.gameOutcome
      );
      games.set(row.gameId, game);
    }
    const card = new Card(
      row.cardId,
      row.cardName,
      row.cardImage,
      row.cardMisfortune
    );
    const round = new Round(
      row.roundId,
      row.gameId,
      row.roundCreatedAt,
      row.roundNumber,
      row.roundOutcome,
      card
    );
    game.rounds.push(round);
    return games;
  }, new Map());
  return Array.from(games.values());
};

export const getGame = (id) => {
  const sql = `
    SELECT 
      game.id AS gameId,
      game.userId,
      game.createdAt AS gameCreatedAt,
      game.outcome AS gameOutcome,
      round.id AS roundId,
      round.createdAt AS roundCreatedAt,
      round.number AS roundNumber,
      round.outcome AS roundOutcome,
      card.id AS cardId,
      card.name AS cardName,
      card.image AS cardImage,
      card.misfortune AS cardMisfortune
    FROM game
    JOIN round ON round.gameId = game.id
    JOIN card ON round.cardId = card.id
    WHERE game.id = ?
    ORDER BY round.number
  `;
  const rows = db.prepare(sql).all(id);
  if (rows.length === 0) return null;
  const game = rows.reduce((game, row) => {
    if (!game)
      game = new Game(
        row.gameId,
        row.userId,
        row.gameCreatedAt,
        row.gameOutcome
      );
    const card = new Card(
      row.cardId,
      row.cardName,
      row.cardImage,
      row.cardMisfortune
    );
    const round = new Round(
      row.roundId,
      row.gameId,
      row.roundCreatedAt,
      row.roundNumber,
      row.roundOutcome,
      card
    );
    game.rounds.push(round);
    return game;
  }, null);
  return game;
};

export const addGame = (userId, createdAt, outcome) => {
  const sql = "INSERT INTO game (userId, createdAt, outcome) VALUES (?, ?, ?)";
  const info = db.prepare(sql).run(userId, createdAt.format(), outcome);
  return info.lastInsertRowid;
};

export const updateGame = (id, outcome) => {
  const sql = "UPDATE game SET outcome = ? WHERE id = ?";
  const info = db.prepare(sql).run(outcome, id);
  return info.changes;
};

/** ROUND **/

export const addRound = (gameId, createdAt, number, outcome, cardId) => {
  const sql = `
    INSERT INTO round (gameId, createdAt, number, outcome, cardId) 
    VALUES (?, ?, ?, ?, ?)`;
  const info = db
    .prepare(sql)
    .run(gameId, createdAt.format(), number, outcome, cardId);
  return info.lastInsertRowid;
};

export const updateRound = (id, outcome) => {
  const sql = "UPDATE round SET outcome = ? WHERE id = ?";
  const info = db.prepare(sql).run(outcome, id);
  return info.changes;
};

/** USER **/

export const getUser = (email) => {
  const sql = "SELECT * FROM user WHERE email = ?";
  const row = db.prepare(sql).get(email);
  if (!row) return null;
  return new User(row.id, row.username, row.email, row.password, row.salt);
};
