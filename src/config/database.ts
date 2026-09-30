import path from "node:path";
import { Sequelize } from "sequelize";

const storage =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : process.env.DB_STORAGE ?? path.resolve(process.cwd(), "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

export default sequelize;

