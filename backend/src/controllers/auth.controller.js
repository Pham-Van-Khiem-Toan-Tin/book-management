const jwt = require("jsonwebtoken");
require("dotenv").config();
const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const BusinessException = require("../utils/error.util");
const userModel = require("../models/user.model");

module.exports.renewToken = catchAsyncError(async (req, res, next) => {
  const { rft: refreshToken } = req.cookies;
  if (!refreshToken) throw new BusinessException(401, "Invalid login session!");
  try {
    const decode = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    let user = await userModel.findById(decode.sub);
    if (!user) {
      throw new BusinessException(
        500,
        "Request could not be processed. Please try again later."
      );
    }
    user = await user.populate({
      path: "role",
      select: "_id functions",
      populate: {
        path: "functions",
        select: "_id subFunctions",
        populate: {
          path: "subFunctions",
          select: "_id authorities",
          match: {
            authorities: user.role,
          },
        },
      },
    });
    const authorities = [user.role._id];
    const functions = user.role.functions;
    functions.forEach((functionItem) => {
      authorities.push(functionItem._id);
      functionItem.subFunctions.forEach((subFunction) => {
        authorities.push(subFunction._id);
      });
    });
    console.log(authorities);

    const accessToken = jwt.sign(
      {
        sub: user._id,
        name: user.name,
        email: user?.email,
        roles: authorities,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRED }
    );
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    if (error?.name == "TokenExpiredError") {
      throw new BusinessException(
        420,
        "Your session has expired. Please log in again."
      );
    } else {
      console.log(error);

      throw new BusinessException(
        500,
        "Request could not be processed. Please try again later."
      );
    }
  }
});

module.exports.baseProfile = catchAsyncError(async (req, res, next) => {
  const id = req.user;
  let user = await userModel.findById(id).select("_id name role library avatar");
  if (!user) throw new BusinessException(500, "Invalid user");
  user = await user.populate({
    path: "role",
    select: "_id functions",
    populate: {
      path: "functions",
      select: "_id subFunctions",
      populate: {
        path: "subFunctions",
        select: "_id authorities",
        match: {
          authorities: user.role,
        },
      },
    },
  });
  const authorities = [user.role._id];
  const functions = user.role.functions;
  functions.forEach((functionItem) => {
    authorities.push(functionItem._id);
    functionItem.subFunctions.forEach((subFunction) => {
      authorities.push(subFunction._id);
    });
  });
  res.status(200).json({
    sub: user._id,
    name: user.name,
    library: user.library,
    roles: authorities,
    avatar: user.avatar
  })
});
