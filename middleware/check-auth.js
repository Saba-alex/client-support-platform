const HttpError = require("../http.error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Authentication failed");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodedToken.userId;
    req.isAdmin= decodedToken.isAdmin
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 403);
    return next(error);
  }
};
