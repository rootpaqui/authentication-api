import express from "express";
import cors from "cors";
import sequelize from "./src/config/sequelize.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
sequelize.initDb();


app.use((request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, () =>
  console.log(`Server started and running on: ${process.env.BASE_URL}:${PORT}`)
);
