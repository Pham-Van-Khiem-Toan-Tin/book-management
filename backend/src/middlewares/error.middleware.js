const BusinessException = require("../utils/error.util");
const AuthenticationException = require("../utils/errorAuth.util");
require("dotenv").config();
const errorHandler = (err, req, res, next) => {
    if (err instanceof BusinessException) {
      // Nếu lỗi là BusinessException
      return res.status(err.statusCode).send(err.message);
    }
    console.log(err);
    if (err instanceof AuthenticationException) {
      return res.redirect(process.env.ERROR_LOGIN_URL + encodeURIComponent(err.message));
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
    });
  };
  
  module.exports = errorHandler;
  