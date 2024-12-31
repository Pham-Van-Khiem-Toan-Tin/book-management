const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const userModel = require("../models/user.model");
const BusinessException = require("../utils/error.util");

module.exports.allUsers = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let users = await userModel
    .find({ name: { $regex: regexKeyword } })
    .select("_id name email role createdAt lock")
    .populate("role", "name")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await userModel.countDocuments({
    name: { $regex: regexKeyword },
  });

  if (!users) users = [];
  res.status(200).json({
    users: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.allReader = catchAsyncError(async (req, res, next) => {
  const { keyword } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  let readers = await userModel.find({ role: "READER", $or: [
    { name: { $regex: regexKeyword } },
    { email: { $regex: regexKeyword } },
    { phone: { $regex: regexKeyword } },
  ]}).select("_id name email phone");
  if (!readers) readers = [];
  res.status(200).json({
    readers: readers,
  });
});

module.exports.viewUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  let user = await userModel
    .findById(id)
    .select("_id name email role library createdAt lock")
    .populate("library", "name")
    .populate("role", "name");
  if (!user) throw new BusinessException(500, "User does not exist!");
  res.status(200).json({
    user: user,
  });
});

module.exports.updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, roleId, libraryId } = req.body;
  if (!id || !name || !email || !roleId || (roleId == "LIBRARIAN" && !libraryId))
    throw new BusinessException(500, "Invalid data");
  const userId = req.user;
  if (id == userId) throw new BusinessException(500, "Cannot update yourself!");
  const user = await userModel.findById(id);
  if (!user) throw new BusinessException(500, "User does not exist!");
  user.name = name;
  user.email = email;
  user.role = roleId;
  user.library = roleId == "LIBRARIAN" ? libraryId : undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User has been updated successfully",
  });
});

module.exports.lockUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id) throw new BusinessException(500, "Invalid data");
  const userId = req.user;
  if (id == userId) throw new BusinessException(500, "Cannot lock yourself!");
  const user = await userModel.findByIdAndUpdate(id, { lock: status });
  if (!user) throw new BusinessException(500, "User does not exist!");
  res.status(200).json({
    success: true,
    message: `User has been ${status ? "locked" : "unlocked"}`,
  });
});
