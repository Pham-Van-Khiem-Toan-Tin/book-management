const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const bookcaseModel = require("../models/bookcase.model");
const bookshelfModel = require("../models/bookshelf.model");
const BusinessException = require("../utils/error.util");

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await bookshelfModel
    .find({ name: { $regex: regexKeyword } })
    .select("_id name description bookcase createdAt")
    .populate({
      path: "bookcase",
      select: "_id name library",
      populate: {
        path: "library",
        select: "_id name",
      },
    })
    .skip(skip)
    .limit(parseInt(limit));
  const total = await bookshelfModel.countDocuments({
    name: { $regex: regexKeyword },
  });
  if (!list) list = [];
  res.status(200).json({
    bookshelves: list,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.viewBookshelf = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  let bookshelf = await bookshelfModel
    .findById(id)
    .select("_id name description bookcase createdAt")
    .populate({
      path: "bookcase",
      select: "_id name library",
      populate: {
        path: "library",
        select: "_id name",
      },
    });
  if (!bookshelf) throw new BusinessException(500, "Bookshelf does not exist!");
  res.status(200).json({
    bookshelf: bookshelf,
  });
});

module.exports.addBookshelf = catchAsyncError(async (req, res, next) => {
  const { name, description, bookcaseId } = req.body;
  if (!name || !description || !bookcaseId)
    throw new BusinessException(500, "Invalid data");
  const existsBookcase = await bookcaseModel.exists({ _id: bookcaseId });
  if (!existsBookcase)
    throw new BusinessException(500, "Bookcase does not exist!");
  const exists = await bookshelfModel.exists({
    name: name,
    bookcase: bookcaseId,
  });
  if (exists)
    throw new BusinessException(500, "The bookshelf that already exists!");
  await bookshelfModel.create({
    name: name,
    description: description,
    bookcase: bookcaseId,
  });
  res.status(200).json({
    success: true,
    message: "Bookshelf added successfully!",
  });
});

module.exports.updateBookshelf = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, bookcaseId } = req.body;
  if (!id || !name || !description || !bookcaseId)
    throw new BusinessException(500, "Invalid data");
  const exists = await bookshelfModel.exists({
    name: name,
    bookcase: bookcaseId,
  });
  if (exists)
    throw new BusinessException(500, "The bookshelf that already exists!");
  await bookshelfModel.findByIdAndUpdate(id, {
    name: name,
    description: description,
    bookcase: bookcaseId,
  });
  res.status(200).json({
    success: true,
    message: "Bookshelf updated successfully!",
  });
});

module.exports.deleteBookshelf = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Invalid data");
  let bookshelf = await bookshelfModel.findById(id);
  if (!bookshelf) throw new BusinessException(500, "Bookshelf does not exist!");
  await bookshelfModel.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Bookshelf deleted successfully!",
  });
});
