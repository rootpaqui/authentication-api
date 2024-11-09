const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./src/config/sequelize.mjs");
const authRouter = require("./src/routes/auth.mjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()).use(cors()).use(cookieParser());
sequelize.initDb();

app.use(authRouter);

app.use((request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, () =>
  console.log(`Server started and running on: ${process.env.BASE_URL}:${PORT}`)
);
