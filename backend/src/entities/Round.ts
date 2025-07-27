import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "@entities/Card";
import { Game } from "@entities/Game";
import { Outcome } from "@utils/Constants";

@Entity()
export class Round {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column("integer")
  number: number;

  @Column({
    type: "enum",
    enum: Outcome,
    default: Outcome.NOT_ENDED,
  })
  outcome: Outcome;

  @ManyToOne(() => Card)
  card: Card;

  @ManyToOne(() => Game, (game) => game.rounds)
  game: Game;
}
