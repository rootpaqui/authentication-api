const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { launchDatabaseConnection } = require("./config/sequelize");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cors())
  .use(cookieParser());

app.use('/', require('./routes'));

app.use((request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, async () => {
  await launchDatabaseConnection();
  console.log(`Server started and running on ${process.env.BASE_URL}:${PORT}`);
});
