import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const register = (request, response) => {
  bcrypt
    .hash("password", 10)
    .then((hashedPassword) =>
      User.create({
        username: "admin",
        email: request.body.email,
        password: hashedPassword,
      })
    )
    .then((user) => console.log(user.toJSON()));
};

const login = (request, response) => {
  const errorMessage = "Invalid email or password.";
  User.findOne({ where: { email: request.body.email } })
    .then((user) => {
      if (!user) {
        return response.status(401).json({ errorMessage });
      }

      bcrypt
        .compare(request.body.password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return response.status(401).json({ errorMessage });
          }

          const token = jwt.sign({ userId: user.id }, privateKey, {
            expiresIn: "24h",
          });

          return response.json({
            message: "Authentication successful",
            data: user,
            token,
          });
        });
    })
    .catch((error) =>
      response.json({ message: "Authentication failed.", data: error })
    );
};
