const jwt = require("jsonwebtoken");
const BusinessException = require("../utils/error.util");
require("dotenv").config();

module.exports.isAuthenticated = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return next(
      new BusinessException(401, "Bạn cần đăng nhập để thực hiện thao tác này!")
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
      res.status(498).send("Hết phiên làm việc!");
      return next(new BusinessException(498, "Hết phiên làm việc!"));
    } else {
      return next(new BusinessException(401, "Phiên làm việc không hợp lệ!"));
    }
  }
};

module.exports.isAuthorization = (role) => {
  return (req, res, next) => {
    if (!req.roles.includes(role)) {
      return next(new BusinessException(403, "Bạn không có quyền thực hiện thao tác này!"));
    }
    next();
  };
};
