const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !request.cookies?.refreshJWT)
    return response.sendStatus(401);

  try {
    const reqRefreshToken = request.cookies.refreshJWT;
    const accessToken = authorizationHeader.split(" ")[1];

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedToken) => {
        if (error || decodedToken.token !== reqRefreshToken) return response.sendStatus(403);

        const user = await User.findOne({
          where: { refreshToken: decodedToken.token },
        });
        if (!user) return response.sendStatus(401);

        request.user = user;

        next();
      }
    );
  } catch (error) {
    return response.status(401).json({ error });
  }
};
