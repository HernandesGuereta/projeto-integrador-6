const path = require("path");
const { Sequelize } = require("sequelize");

const storage =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : process.env.DB_STORAGE || path.resolve(__dirname, "../../database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

module.exports = sequelize;
