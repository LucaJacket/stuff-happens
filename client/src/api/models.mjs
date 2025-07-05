import dayjs from "dayjs";

class Card {
  constructor(name, image, misfortune) {
    this.name = name;
    this.image = image;
    this.misfortune = misfortune;
  }
}

class Game {
  constructor(id, createdAt, outcome, rounds) {
    this.id = id;
    this.createdAt = dayjs(createdAt);
    this.outcome = outcome;
    this.rounds = rounds;
  }
}

class Round {
  constructor(number, outcome, card) {
    this.number = number;
    this.outcome = outcome;
    this.card = card;
  }
}

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
}

export { Card, Game, Round, User };