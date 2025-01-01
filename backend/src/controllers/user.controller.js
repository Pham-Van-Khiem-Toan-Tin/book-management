const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const userModel = require("../models/user.model");
const BusinessException = require("../utils/error.util");

module.exports.allUsers = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  const user = await userModel.findById(req.user).populate("role", "order");
  let users = await userModel.aggregate([
    {
      $match: {
        name: { $regex: regexKeyword },
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: "$role",
    },
    {
      $match: {
        "role.order": { $lte: user.role.order },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        role: {
          _id: "$role._id",
          name: "$role.name",
          order: "$role.order",
        },
        library: 1,
        createdAt: 1,
        lock: 1,
      },
    },
    { $skip: skip },
    { $limit: parseInt(limit) },
  ]);
  const total = await userModel.aggregate([
    {
      $match: {
        name: { $regex: regexKeyword },
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: "$role",
    },
    {
      $match: {
        "role.order": { $lte: user.role.order },
      },
    },
    {
      $count: "total",
    }
  ])

  if (!users) users = [];
  res.status(200).json({
    users: users,
    pagination: {
      total: total[0]?.total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.allReader = catchAsyncError(async (req, res, next) => {
  const { keyword } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  let readers = await userModel
    .find({
      role: "READER",
      $or: [
        { name: { $regex: regexKeyword } },
        { email: { $regex: regexKeyword } },
        { phone: { $regex: regexKeyword } },
      ],
    })
    .select("_id name email phone");
  if (!readers) readers = [];
  res.status(200).json({
    readers: readers,
  });
});

module.exports.viewUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  let user = await userModel
    .findById(id)
    .select("_id name email role library createdAt lock")
    .populate("library", "name")
    .populate("role", "name");
  if (!user) throw new BusinessException(500, "Không tìm thấy người dùng!");
  res.status(200).json({
    user: user,
  });
});

module.exports.updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, roleId, libraryId } = req.body;
  if (
    !id ||
    !name ||
    !email ||
    !roleId ||
    (roleId == "LIBRARIAN" && !libraryId)
  )
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const userId = req.user;
  if (id == userId) throw new BusinessException(500, "Bạn không thể chỉnh sửa thông tin của chính mình!");
  const user = await userModel.findById(id);
  if (!user) throw new BusinessException(500, "Không tìm thấy người dùng!");
  user.name = name;
  user.email = email;
  user.role = roleId;
  user.library = roleId == "LIBRARIAN" ? libraryId : undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Cập nhật thông tin người dùng thành công!",
  });
});

module.exports.lockUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const userId = req.user;
  if (id == userId) throw new BusinessException(500, "Bạn không thể khóa chính mình!");
  const user = await userModel.findByIdAndUpdate(id, { lock: status });
  if (!user) throw new BusinessException(500, "Không tìm thấy người dùng!");
  res.status(200).json({
    success: true,
    message: `Người dùng đã ${status ? "bị khoá" : "được mở khoá"}!`,
  });
});
