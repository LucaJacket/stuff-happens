import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "test",
  password: process.env.DB_PASSWORD || "test",
  database: process.env.DB_NAME || "test",
  synchronize: process.env.NODE_ENV !== "production",
  logging: true,
  entities: [User],
  subscribers: [],
});
