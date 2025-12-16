import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Operator } from "src/modules/operator/entities/operator.entity";
dotenv.config(); 

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User,Operator],
  migrations: ["src/migrations/*.ts"],
});