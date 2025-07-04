import dotenv from "dotenv";
import { Card, Game, Round, User } from "../models/models.mjs";

dotenv.config();

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

const SERVER_URL = `http://${HOST}:${PORT}`;

export const listGames = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/games`, {
      credentials: "include"
    });
    switch (res.status) {
      case 200: {
        const gamesJson = await res.json();
        return gamesJson.map((game) => {
          const rounds = game.rounds.map((round) => {
            const card = new Card(
              round.card.name,
              round.card.image,
              round.card.misfortune
            );
            return new Round(round.number, round.outcome, card);
          });
          return new Game(game.createdAt, game.outcome, rounds);
        });
      }
      case 401:
        throw new Error("Utente non autenticato.");
      default:
        throw new Error("Impossibile recuperare le partite.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const addGame = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/games`, {
      method: "POST",
      credentials: "include"
    });
    switch (res.status) {
      case 201:
        return await res.json();
      default:
        throw new Error("Impossibile creare la partita.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const getGame = async (id) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/games/${id}`, {
      credentials: "include"
    });
    switch (res.status) {
      case 200:
        const gameJson = await res.json();
        const rounds = gameJson.rounds.map((round) => {
          const card = new Card(
            round.card.name,
            round.card.image,
            round.card.misfortune
          );
          return new Round(round.number, round.outcome, card);
        });
        return new Game(gameJson.createdAt, gameJson.outcome, rounds);
      case 401:
        throw new Error("Utente non autenticato.");
      case 403:
        throw new Error("Permessi insufficienti.");
      case 404:
        throw new Error("Partita non trovata.");
      default:
        throw new Error("Impossibile recuperare la partita.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const updateGame = async (id, index) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/games/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index })
    });
    switch (res.status) {
      case 204:
        return null;
      case 401:
        throw new Error("Utente non autenticato.");
      case 403:
        throw new Error("Permessi insufficienti.");
      case 404:
        throw new Error("Partita o round non trovati.");
      case 409:
        throw new Error("Partita già terminata.");
      default:
        throw new Error("Impossibile aggiornare la partita.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const addRound = async (id) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/games/${id}/rounds`, {
      method: "POST",
      credentials: "include",
    });
    switch (res.status) {
      case 201:
        return await res.json();
      case 401:
        throw new Error("Utente non autenticato.");
      case 403:
        throw new Error("Permessi insufficienti.");
      case 404:
        throw new Error("Partita non trovata.");
      case 409:
        throw new Error("Partita già terminata.");
      default:
        throw new Error("Impossibile creare il round.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const logIn = async (credentials) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    switch (res.status) {
      case 201:
        return null;
      case 401:
        throw new Error("Email o password non corretti.");
      default:
        throw new Error("Impossibile effettuare il login.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const getUserInfo = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/sessions/current`, {
      credentials: "include",
    });
    switch (res.status) {
      case 200:
        const userJson = await res.json();
        return new User(userJson.username, userJson.email);
      case 401:
        return null;
      default:
        throw new Error("Impossibile recuperare l'utente.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};

export const logOut = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/sessions/current`, {
      method: "DELETE",
      credentials: "include",
    });
    switch (res.status) {
      case 204:
        return null;
      default:
        throw new Error("Impossibile effettuare il logout.");
    }
  } catch {
    throw new Error("Impossibile contattare il server.");
  }
};
