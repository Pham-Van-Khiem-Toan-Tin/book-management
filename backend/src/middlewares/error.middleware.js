const BusinessException = require("../utils/error.util");

const errorHandler = (err, req, res, next) => {
    if (err instanceof BusinessException) {
      // Nếu lỗi là BusinessException
      return res.status(err.statusCode).send(err.message);
    }
    console.log(err);
    
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  };
  
  module.exports = errorHandler;
  