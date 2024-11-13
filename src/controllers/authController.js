const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password)
    return response.status(400).json("Email and password are required!");
  if (await User.findOne({ where: { email } }))
    return response
      .status(409)
      .json("Email already exists! Please chose another one.");

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

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    const errorMessage = "Invalid email or password.";

    if (!email || !password)
      return response
        .status(400)
        .json({ message: "Email and password are required!" });

    const user = await User.findOne({ where: { email } });
    if (!user) return response.status(401).json(errorMessage);

    if (!(await bcrypt.compare(password, user.password))) {
      return response.status(401).json(errorMessage);
    } else {
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      const accessToken = jwt.sign(
        { token: refreshToken },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const userUpdated = await user.update({ refreshToken });
      if (userUpdated) {
        response.cookie("refreshJWT", refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return response.json({
          message: "Authentication successful",
          data: userUpdated,
          accessToken,
        });
      }
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: "Authentication failed.", data: error });
  }
};

const refreshToken = async (request, response) => {
  try {
    if (!request.cookies?.refreshJWT) return response.sendStatus(401);

    const refreshToken = request.cookies.refreshJWT;

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return response.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decodedToken) => {
        if (error || user.id !== decodedToken.userId)
          return response.sendStatus(403);

        const accessToken = jwt.sign(
          { token: refreshToken },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        return response.json({
          message: "Token have been regenerated.",
          accessToken,
        });
      }
    );
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Token regeneration failed.", data: error });
  }
};

const logout = async (request, response) => {
  if (!request.cookies?.refreshJWT) return response.sendStatus(204);

  try {
    const refreshToken = request.cookies.refreshJWT;

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      response.clearCookie("refreshJWT", { httpOnly: true });
      return response.sendStatus(401);
    }

    if (await user.update({ refreshToken: null })) {
      response.clearCookie("refreshJWT", { httpOnly: true });
      return response.status(200).json({ message: "You are disconnected!" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: "Oops! Something went wrong.", data: error });
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
};
