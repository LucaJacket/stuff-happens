import express from "express";
import session from "express-session";
import { body, param, validationResult } from "express-validator";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";
import dayjs from "dayjs";
import crypto from "crypto";
import {
  listCards,
  listGames,
  addGame,
  getGame,
  updateGame,
  addRound,
  updateRound,
  getUser,
} from "./database.mjs";

const GAME = {
  win: 3,
  lose: 3,
};
const DEMO_GAME = {
  win: 1,
  lose: 1,
};
const INITIAL_CARDS = 3;
const NOT_ENDED = 0;
const LOST = 1;
const WON = 2;

dotenv.config();

const SECRET = process.env.SECRET;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

const corsOptions = {
  origin: `http://${HOST}:5173`,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

passport.use(
  new LocalStrategy(function (username, password, done) {
    try {
      const user = getUser(username);
      if (!user) return done(null, false, "Incorrect username or password.");
      const hashedPassword = crypto.scryptSync(password, user.salt, 32);
      const storedPassword = Buffer.from(user.password, "hex");
      if (!crypto.timingSafeEqual(storedPassword, hashedPassword))
        return done(null, false, "Incorrect username or password.");
      return done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

/** MIDDLEWARES **/

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(401).end();
  return next();
};

const isValid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  return next();
};

/** ROUTES **/

app.get("/api/games", isLoggedIn, (req, res) => {
  try {
    const games = listGames(req.user.id);
    games.forEach((game) => {
      delete game.id;
      delete game.userId;
      game.rounds.forEach((round) => {
        delete round.id;
        delete round.gameId;
        delete round.createdAt;
        delete round.card.id;
        if (round.outcome !== WON) delete round.card.misfortune;
      });
    });
    return res.status(200).json(games);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

app.post("/api/games", (req, res) => {
  try {
    const userId = req.isAuthenticated() ? req.user.id : null;
    const gameId = addGame(userId, dayjs(), NOT_ENDED);
    listCards()
      .slice(0, INITIAL_CARDS)
      .forEach((card) => addRound(gameId, dayjs(), 0, WON, card.id));
    return res.status(201).json(gameId);
  } catch {
    return res.status(500).end();
  }
});

app.get("/api/games/:id", param("id").isInt().toInt(), isValid, (req, res) => {
  try {
    const game = getGame(req.params.id);
    if (!game) return res.status(404).end();
    const userId = req.isAuthenticated() ? req.user.id : null;
    if (game.userId !== userId) return res.status(403).end();
    delete game.id;
    delete game.userId;
    game.rounds.forEach((round) => {
      delete round.id;
      delete round.gameId;
      delete round.createdAt;
      delete round.card.id;
      if (round.outcome !== WON) delete round.card.misfortune;
    });
    return res.status(200).json(game);
  } catch {
    return res.status(500).end();
  }
});

app.put(
  "/api/games/:id",
  param("id").isInt().toInt(),
  body("index").isInt().toInt(),
  isValid,
  (req, res) => {
    try {
      const game = getGame(req.params.id);
      if (!game) return res.status(404).end();
      const userId = req.isAuthenticated() ? req.user.id : null;
      if (game.userId !== userId) return res.status(403).end();
      const current = game.rounds.find((round) => round.outcome === NOT_ENDED);
      if (!current) return res.status(409).end();
      const hand = game.rounds
        .filter((round) => round.outcome !== LOST)
        .sort((a, b) => a.card.misfortune - b.card.misfortune);
      const outcome = hand.indexOf(current) === req.body.index ? WON : LOST;
      updateRound(current.id, outcome);
      const config = userId ? GAME : DEMO_GAME;
      if (outcome === WON) {
        const won =
          game.rounds.filter((round) => round.outcome === WON).length + 1;
        if (won === config.win) updateGame(game.id, WON);
      } else {
        const lost =
          game.rounds.filter((round) => round.outcome === LOST).length + 1;
        if (lost === config.lose) updateGame(game.id, LOST);
      }
      return res.status(200).end();
    } catch {
      return res.status(500).end();
    }
  }
);

app.post(
  "/api/games/:id/rounds",
  param("id").isInt().toInt(),
  isValid,
  (req, res) => {
    try {
      const game = getGame(req.params.id);
      if (!game) return res.status(404).end();
      const userId = req.isAuthenticated() ? req.user.id : null;
      if (game.userId !== userId) return res.status(403).end();
      const card = listCards()[0];
      const roundId = addRound(game.id, dayjs(), 0, NOT_ENDED, card.id);
      return res.status(201).json(roundId);
    } catch {
      return res.status(500).end();
    }
  }
);

app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  delete req.user.id;
  return res.status(201).json(req.user);
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    delete req.user.id;
    return res.status(200).json(req.user);
  }
  return res.status(204).end();
});

app.delete("/api/sessions/current", (req, res) => {
  return req.logout(() => {
    return res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
