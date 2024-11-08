import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./src/config/sequelize.mjs";
import authRouter from "./src/routes/auth.mjs";


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json()).use(cors());
sequelize.initDb();

app.use(authRouter);

app.use((request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, () =>
  console.log(`Server started and running on: ${process.env.BASE_URL}:${PORT}`)
);
