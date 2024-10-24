import { verify } from "jsonwebtoken";

export default (request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    const message = `Authentication token is missing.`;
    return response.status(401).json({ message });
  }

  const token = authorizationHeader.split(" ")[1];
  const decodedToken = verify(token, process.env.JWT_PRIVATE_KEY, (error, decodedToken) => {
    if (error) {
      const message = `Invalid token.`;
      return response.status(401).json({ message, data: error });
    }

    const userId = decodedToken.userId;
    if (request.body.userId && request.body.userId !== userId) {
      const message = `User is not valid`;
      res.status(401).json({ message });
    } else {
      next();
    }
  });
};
