const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const userModel = require("../models/user.model");
const BusinessException = require("../utils/error.util");
const cloudinary = require("cloudinary");
const fs = require("fs");

module.exports.viewProfile = catchAsyncError(async (req, res, next) => {
  const sub = req.user;
  let user = await userModel
    .findById(sub)
    .select("name email phone library avatar role createdAt")
    .populate("library", "name")
    .populate("role", "name");
    if (typeof user.avatar === "string") user.avatar = { url: user.avatar, public_id: null };
  if (!user) throw new BusinessException(500, "Không tìm thấy người dùng");
  res.status(200).json({
    user,
  });
});

module.exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const sub = req.user;
  const { name, phone } = req.body;
  if (!name && !phone)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const user = await userModel.findById(sub);
  if (!user) throw new BusinessException(500, "Không tìm thấy người dùng");
  let newAvatar;
  if (req.files && req.files.avatar) {
    const image = req.files.avatar;
    try {
      if (user.avatar.startsWith("https://res.cloudinary.com")) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
        folder: "avatars",
      });
      newAvatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      fs.unlink(image.tempFilePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    } catch (error) {
      console.log(error);
      throw new BusinessException(
        500,
        "Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau!"
      );
    }
  }
  user.avatar = newAvatar || user.avatar;
  user.name = name;
  user.phone = phone;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Câp nhật thông tin thành công",
  });
});
