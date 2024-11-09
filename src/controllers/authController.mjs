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
      console.log('l');
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
      return response
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

          const accessToken = jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "2h",
            }
          );

          const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "30d",
            }
          );

          user.update({ refreshToken }).then((userUpdated) => {
            response.cookie("refreshJWT", refreshToken, {
              httpOnly: true,
              maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            return response.json({
              message: "Authentication successful",
              data: userUpdated,
              accessToken,
            });
          });
        });
    })
    .catch((error) =>
      response.json({ message: "Authentication failed.", data: error })
    );
};

const refreshToken = (request, response) => {
  if (!request.cookies?.refreshJWT) return response.sendStatus(401);

  const token = request.cookies.refreshJWT;
  User.findOne({ where: { refreshToken: token } })
    .then((user) => {
      if (!user) return response.sendStatus(403);

      jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decodedToken) => {
          if (error || user.id !== decodedToken.userId)
            return response.sendStatus(403);

          const accessToken = jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "2h",
            }
          );

          return response.json({
            message: "Token have been refreshed.",
            accessToken,
          });
        }
      );
    })
    .catch((error) =>
      response.json({ message: "Token refreshing failed.", data: error })
    );
};

export default {
  login,
  register,
  refreshToken,
};
