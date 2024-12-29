const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const bookcaseModel = require("../models/bookcase.model");
const categoryModel = require("../models/categories.model");
const libraryModel = require("../models/library.model");
const BusinessException = require("../utils/error.util");

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await bookcaseModel
    .find({ name: { $regex: regexKeyword } })
    .select("_id name description library createdAt")
    .populate("library", "_id name")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await bookcaseModel.countDocuments({
    name: { $regex: regexKeyword },
  });
  if (!list) list = [];
  res.status(200).json({
    bookcases: list,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.common = catchAsyncError(async (req, res, next) => {
  let list = await bookcaseModel
    .find({})
    .select("_id name code library")
    .populate("library", "_id name");
  if (!list) list = [];
  res.status(200).json({
    bookcases: list,
  });
});

module.exports.viewBookcase = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  let bookcase = await bookcaseModel
    .findById(id)
    .select("_id code name description library createdAt")
    .populate("library", "_id name");
  if (!bookcase) throw new BusinessException(500, "Bookcase does not exist!");
  res.status(200).json({
    bookcase: bookcase,
  });
});

module.exports.addBookcase = catchAsyncError(async (req, res, next) => {
  const { id, name, description, libraryId } = req.body;
  if (!id || !name || !description || !libraryId)
    throw new BusinessException(500, "Invalid data");
  const existsLibrary = await libraryModel.exists({ _id: libraryId });
  if (!existsLibrary)
    throw new BusinessException(500, "Library does not exist!");
  const exists = await bookcaseModel.exists({ name: name, library: libraryId });
  if (exists)
    throw new BusinessException(500, "The bookcase that already exists!");
  await bookcaseModel.create({
    code: id,
    name: name,
    description: description,
    library: libraryId,
  });
  res.status(200).json({
    success: true,
    message: "Bookcase added successfully!",
  });
});

module.exports.editBookcase = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { _id, id: code, name, description, libraryId } = req.body;
  if (
    !_id ||
    !name ||
    !description ||
    !libraryId ||
    !code ||
    id !== _id  )
    throw new BusinessException(500, "Invalid data");
  const existsLibrary = await libraryModel.exists({ _id: libraryId });
  if (!existsLibrary)
    throw new BusinessException(500, "Library does not exist!");
  let bookcase = await bookcaseModel.findById(id);
  if (!bookcase) throw new BusinessException(500, "Bookcase does not exist!");
  bookcase.name = name;
  bookcase.description = description;
  bookcase.library = libraryId;
  bookcase.code = code;
  await bookcase.save();
  res.status(200).json({
    success: true,
    message: "Bookcase updated successfully!",
  });
});

module.exports.deleteBookcase = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  let bookDelete = await bookcaseModel.findByIdAndDelete(id);
  if (!bookDelete)
    throw new BusinessException(500, "The bookcase does not exist!");
  res.status(200).json({
    success: true,
    message: "Bookcase deleted successfully!",
  });
});
