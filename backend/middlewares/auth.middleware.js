const jwt = require("jsonwebtoken");
const BusinessException = require("../utils/error.util");
require("dotenv").config();

module.exports.isAuthenticated = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return next(
      new BusinessException(401, "Please sign in to access the resource")
    );
  }
  const accessToken = authorization.split(" ")[1];
  try {
    const decodeData = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decodeData.sub;
    req.roles = decodeData.roles;
    next();
  } catch (error) {
    if (error?.name == "TokenExpiredError") {
      res.status(498).send("Token is expired!");
      return next(new BusinessException(498, "Token is expired!"));
    } else {
      return next(new BusinessException(401, "Invalid login session!"));
    }
  }
};

module.exports.isAuthorization = (role) => {
  return (req, res, next) => {
    if (!req.roles.includes(role)) {
      return next(new BusinessException(403, "No access to resources"));
    }
    next();
  };
};
