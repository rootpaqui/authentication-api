const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password)
    return response.status(400).json("Email and password are required!");
  // const existingUser = await User.findOne({ where: { email } });
  if (await User.findOne({ where: { email } })) {
    return response
      .status(409)
      .json("Email already exists! Please chose another one.");
  }
  try {
    const passwordHashed = await bcrypt.hash("password", 10);
    const user = await User.create({ email, password: passwordHashed });
    response.status(201).json({ message: "Success.", user });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Oops! An error has occurred", data: error });
  }
};

const login = (request, response) => {
  const errorMessage = "Invalid email or password.";
  const { email, password } = request.body;
  if (!email || !password)
    return response
      .status(400)
      .json({ message: "Email and password are required!" });
  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return response.status(401).json(errorMessage);
      }

      bcrypt.compare(password, user.password).then((isPasswordValid) => {
        if (!isPasswordValid) {
          return response.status(401).json(errorMessage);
        }

        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "2h" }
        );

        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "30d" }
        );

        user.update({ refreshToken }).then((userUpdated) => {
          response.cookie("refreshJWT", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
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
      response
        .status(500)
        .json({ message: "Authentication failed.", data: error })
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
            message: "Token have been regenerated.",
            accessToken,
          });
        }
      );
    })
    .catch((error) =>
      response.json({ message: "Token regeneration failed.", data: error })
    );
};

const logout = (request, response) => {
  if (!request.cookies?.refreshJWT) return response.sendStatus(204);

  const token = request.cookies.refreshJWT;
  User.findOne({ where: { refreshToken: token } })
    .then((user) => {
      if (!user) {
        response.clearCookie("refreshJWT", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        return response.sendStatus(401);
      }

      user.update({ refreshToken: null }).then((userUpdated) => {
        response.clearCookie("refreshJWT", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        // Chercher le bon code de status renvoyer lors d'une déconnexion
        // Traduire <Vous êtes déconnecter!> en anglais
        response.status(204).json("Vous êtes déconnecter!");
      });
    })
    .catch((error) =>
      response.json({ message: "Token regeneration failed.", data: error })
    );
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
};
