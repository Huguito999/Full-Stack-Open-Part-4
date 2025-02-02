const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      console.log("Token:", req.token);
      const decodedToken = jwt.verify(req.token, process.env.SECRET);
      console.log("Decoded Token:", decodedToken);
      if (decodedToken.id) {
        req.user = await User.findById(decodedToken.id);
        console.log("User:", req.user);
        if (!req.user) {
          return res.status(401).json({ error: "User not found" });
        }
      } else {
        return res.status(401).json({ error: "Invalid token" });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    req.user = null;
  }
  next();
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
