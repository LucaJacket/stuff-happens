import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Round } from "@entities/Round";
import { User } from "@entities/User";
import { Outcome } from "@utils/Constants";

@Entity()
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: "enum",
    enum: Outcome,
    default: Outcome.NOT_ENDED,
  })
  outcome: Outcome;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Round, (round) => round.game)
  rounds: Round[];
}
