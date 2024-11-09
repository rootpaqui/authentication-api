import jwt from "jsonwebtoken";

export default (request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) return response.sendStatus(401);

  const token = authorizationHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
    if (error) return response.sendStatus(403);
    request.user = decodedToken.userId;
    next();
  });
};
