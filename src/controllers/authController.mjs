import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sequelize from "../config/sequelize.mjs";

const User = sequelize.User;

const register = (request, response) => {
  if (!request.body.email || !request.body.password)
    return response
      .status(400)
      .json({ message: "Email and password are required!" });
  User.findOne({ where: { email: request.body.email } })
    .then((user) => {
      if (user) {
        return response
          .status(409)
          .json({ message: "Email already exists! Please chose another one." });
      }

      bcrypt
        .hash("password", 10)
        .then((hashedPassword) =>
          User.create({
            email: request.body.email,
            password: hashedPassword,
          })
        )
        .then((user) => response.status(201).json({ message: "Success." }));
    })
    .catch((error) => {
      response
        .status(500)
        .json({ message: "Oops! An error has occurred", data: error });
    });
};

const login = (request, response) => {
  const errorMessage = "Invalid email or password.";
  if (!request.body.email || !request.body.password)
    return response
      .status(400)
      .json({ message: "Email and password are required!" });
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

          const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_PRIVATE_KEY,
            {
              expiresIn: "24h",
            }
          );

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

export default {
  login,
  register,
};
