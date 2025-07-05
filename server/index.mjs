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
  win: 6,
  lose: 3,
};
const DEMO_GAME = {
  win: 4,
  lose: 1,
};
const INITIAL_CARDS = 3;
const NOT_ENDED = 0;
const LOST = 1;
const WON = 2;
const TIMEOUT = 30;

dotenv.config();

const SECRET = process.env.SECRET || "super_secret_token";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

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
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
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

const checkGame = (req, res, next) => {
  try {
    req.game = getGame(req.params.id);
    if (!req.game) return res.status(404).end();
    const userId = req.isAuthenticated() ? req.user.id : null;
    if (req.game.userId !== userId) return res.status(403).end();
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

/** ROUTES **/

const sanitize = (game) => {
  const { id, createdAt, outcome, rounds } = game;
  const sanitizedRounds = rounds.map(({ number, outcome, card }) => {
    const sanitizedCard = {
      name: card.name,
      image: card.image,
      misfortune: outcome === WON ? card.misfortune : undefined,
    };
    return { number, outcome, card: sanitizedCard };
  });
  return { id, createdAt, outcome, rounds: sanitizedRounds };
};

app.get("/api/games", isLoggedIn, (req, res) => {
  try {
    const games = listGames(req.user.id);
    return res.status(200).json(games.map(sanitize));
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
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

app.get(
  "/api/games/:id",
  param("id").isInt().toInt(),
  isValid,
  checkGame,
  (req, res) => res.status(200).json(sanitize(req.game))
);

app.put(
  "/api/games/:id",
  param("id").isInt().toInt(),
  body("index").isInt().toInt(),
  isValid,
  checkGame,
  (req, res) => {
    try {
      const now = dayjs();
      if (req.game.outcome !== NOT_ENDED) return res.status(409).end();
      const current = req.game.rounds.find(
        (round) => round.outcome === NOT_ENDED
      );
      if (!current) return res.status(404).end();
      let outcome;
      if (now.diff(current.createdAt, "second") > TIMEOUT) {
        outcome = LOST;
      } else {
        const hand = req.game.rounds
          .filter((round) => round.outcome !== LOST)
          .sort((a, b) => a.card.misfortune - b.card.misfortune);
        outcome = hand.indexOf(current) === req.body.index ? WON : LOST;
      }
      updateRound(current.id, outcome);
      const config = req.game.userId ? GAME : DEMO_GAME;
      if (outcome === WON) {
        const won =
          req.game.rounds.filter((round) => round.outcome === WON).length + 1;
        if (won === config.win) updateGame(req.game.id, WON);
      } else {
        const lost =
          req.game.rounds.filter((round) => round.outcome === LOST).length + 1;
        if (lost === config.lose) updateGame(req.game.id, LOST);
      }
      return res.status(200).json(outcome);
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  }
);

app.post(
  "/api/games/:id/rounds",
  param("id").isInt().toInt(),
  isValid,
  checkGame,
  (req, res) => {
    try {
      if (req.game.outcome !== NOT_ENDED) return res.status(409).end();
      const played = req.game.rounds.map((round) => round.card);
      const card = listCards().find((card) => !played.includes(card));
      if (!card) return res.status(404).end();
      const roundId = addRound(
        req.game.id,
        dayjs(),
        played.length - INITIAL_CARDS + 1,
        NOT_ENDED,
        card.id
      );
      return res.status(201).json(roundId);
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  }
);

app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  const user = { username: req.user.username, email: req.user.email };
  return res.status(201).json(user);
});

app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  const user = { username: req.user.username, email: req.user.email };
  return res.status(200).json(user);
});

app.delete("/api/sessions/current", (req, res) => {
  return req.logout(() => {
    return res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
