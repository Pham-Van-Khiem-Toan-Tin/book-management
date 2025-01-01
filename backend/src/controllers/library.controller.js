const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const bookcaseModel = require("../models/bookcase.model");
const borrowModel = require("../models/borrow.model");
const libraryModel = require("../models/library.model");
const BusinessException = require("../utils/error.util");

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await libraryModel
    .find({ name: { $regex: regexKeyword }})
    .select("_id name location createdAt")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await libraryModel.countDocuments({
    name: { $regex: regexKeyword },
  });
  if (!list) list = [];
  res.status(200).json({
    libraries: list,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.allCommon = catchAsyncError(async (req, res, next) => {
  let list = await libraryModel.find({}).select("_id name");
  if (!list) list = [];
  res.status(200).json({
    libraries: list,
  });
});

module.exports.viewLibrary = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  let library = await libraryModel
    .find({ _id: id})
    .select("_id name description location createdAt");
  if (!library) throw new BusinessException(500, "Cơ sở không tồn tại!");
  res.status(200).json({
    library: library,
  });
});

module.exports.addLibrary = catchAsyncError(async (req, res, next) => {
  const { name, description, location } = req.body;
  if (!name || !description || !location)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const exists = await libraryModel.exists({ name: name });
  if (exists)
    throw new BusinessException(500, "Cơ sở đã tồn tại!");
  await libraryModel.create({
    name: name,
    description: description,
    location: location,
  });
  res.status(200).json({
    success: true,
    message: "Cập nhật cơ sở thành công!",
  });
});

module.exports.editLibrary = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, location } = req.body;
  if (!id || !name || !description || !location)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const exists = await libraryModel.exists({ _id: id });
  if (!exists) throw new BusinessException(500, "Cơ sở không tồn tại!");
  await libraryModel.findByIdAndUpdate(id, {
    name: name,
    description: description,
    location: location,
  });
  res.status(200).json({
    success: true,
    message: "Cập nhật cơ sở thành công!",
  });
});


