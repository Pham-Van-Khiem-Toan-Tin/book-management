const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const BusinessException = require("../utils/error.util");
const categoryModel = require("../models/categories.model");

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await categoryModel
    .find({ name: { $regex: regexKeyword } })
    .select("_id name parent_id createdAt")
    .populate("parent_id", "name")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await categoryModel.countDocuments({
    name: { $regex: regexKeyword },
  });
  if (!list) list = [];
  res.status(200).json({
    categories: list,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.categoryCommon = catchAsyncError(async (req, res, next) => {
  let list = await categoryModel.find({ parent_id: null }).select("_id name");
  if (!list) list = [];
  res.status(200).json({
    categories: list,
  });
});

module.exports.categoriesListSelect = catchAsyncError(
  async (req, res, next) => {
    let list = await categoryModel
      .find({ parent_id: { $ne: null } })
      .select("_id name");
    if (!list) list = [];
    res.status(200).json({
      categories: list,
    });
  }
);
module.exports.viewCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  let category = await categoryModel
    .findById(id)
    .select("_id name description parent_id createdAt")
    .populate("parent_id", "name");
  if (!category) throw new BusinessException(500, "Category does not exist!");
  res.status(200).json({
    category: category,
  });
});
module.exports.addCategory = catchAsyncError(async (req, res, next) => {
  const { name, parentId, description } = req.body;
  if (!name || !description) throw new BusinessException(500, "Invalid data");
  const exists = await categoryModel.exists({ name: name });
  if (exists)
    throw new BusinessException(
      500,
      "The category of book that already exists!"
    );
  const existsParent = await categoryModel.exists({
    _id: parentId,
    parent_id: null,
  });
  if (parentId && !existsParent) throw new BusinessException(500, "Parent does not exist!");
  await categoryModel.create({
    name: name,
    parent_id: parentId,
    description: description,
  });
  res.status(200).json({
    success: true,
    message: "Category added successfully!",
  });
});

module.exports.editCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, parentId, description } = req.body;
  if (!id || !name || !description)
    throw new BusinessException(500, "Invalid data");
  const category = await categoryModel.findById(id);
  if (!category) throw new BusinessException(500, "Category does not exist!");
  category.name = name;
  category.parent_id = parentId;
  category.description = description;
  await category.save();
  res.status(200).json({
    success: true,
    message: "Update Category successfully!",
  });
});

module.exports.deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  const exists = await categoryModel.exists({ _id: id });
  if (!exists) throw new BusinessException(500, "Book type does not exist!");
  await categoryModel.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
