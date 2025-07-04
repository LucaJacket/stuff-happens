import dayjs from "dayjs";

class Card {
  constructor(id, name, image, misfortune) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.misfortune = misfortune;
  }
}

class Game {
  constructor(id, userId, createdAt, outcome, rounds = []) {
    this.id = id;
    this.userId = userId;
    this.createdAt = dayjs(createdAt);
    this.outcome = outcome;
    this.rounds = rounds;
  }
}

class Round {
  constructor(id, gameId, createdAt, number, outcome, card) {
    this.id = id;
    this.gameId = gameId;
    this.createdAt = dayjs(createdAt);
    this.number = number;
    this.outcome = outcome;
    this.card = card;
  }
}

class User {
  constructor(id, username, email, password, salt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.salt = salt;
  }
}

export { Card, Game, Round, User };
