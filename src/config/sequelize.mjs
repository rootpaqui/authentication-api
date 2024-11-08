import { DataTypes, Sequelize } from "sequelize";
import UserModel from "../models/User.mjs";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

const User = UserModel(sequelize, DataTypes);

const initDb = () => {
  sequelize
    .sync({ force: false })
    .then(() => console.log("Database created"))
    .catch((err) => console.error("Failed to synchronize the database:", err));
};

export default { initDb, User };
