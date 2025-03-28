const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const bookcaseModel = require("../models/bookcase.model");
const bookshelfModel = require("../models/bookshelf.model");
const categoryModel = require("../models/categories.model");
const BusinessException = require("../utils/error.util");

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await bookshelfModel
    .find({ name: { $regex: regexKeyword } })
    .select("_id name code bookcase createdAt")
    .populate({
      path: "bookcase",
      select: "_id name code library",
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
  if (!id) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  let bookshelf = await bookshelfModel
    .findById(id)
    .select("_id name code description books bookcase createdAt")
    .populate({
      path: "bookcase",
      select: "_id name code library",
      populate: {
        path: "library",
        select: "_id name",
      },
    })
    .populate("books.book", "_id title image")
    .populate("category", "_id name");
  if (!bookshelf) throw new BusinessException(500, "Giá sách không tồn tại!");
  res.status(200).json({
    bookshelf: bookshelf,
  });
});

module.exports.addBookshelf = catchAsyncError(async (req, res, next) => {
  const { code, name, description, bookcaseId, categoryId } = req.body;
  if (!code || !name || !description || !bookcaseId || !categoryId)
    throw new BusinessException(500, "Dữ liệu không hợp lệ");
  const existsBookcase = await bookcaseModel.exists({ _id: bookcaseId });
  if (!existsBookcase)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const existsCategory = await categoryModel.exists({
    _id: categoryId,
    parent_id: { $ne: null },
  });
  if (!existsCategory)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const exists = await bookshelfModel.exists({
    code: code,
    bookcase: bookcaseId,
  });
  if (exists)
    throw new BusinessException(500, "Giá sách đã tồn tại!");
  await bookshelfModel.create({
    code: code,
    name: name,
    description: description,
    bookcase: bookcaseId,
    category: categoryId
  });
  res.status(200).json({
    success: true,
    message: "Thêm mới giá sách thành công!",
  });
});

module.exports.updateBookshelf = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { code, name, description, bookcaseId } = req.body;
  if (!id || !name || !description || !bookcaseId)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const exists = await bookshelfModel.exists({
    code: code,
    bookcase: bookcaseId,
  });
  if (exists)
    throw new BusinessException(500, "Giá sách đã tồn tại!");
  await bookshelfModel.findByIdAndUpdate(id, {
    code: code,
    name: name,
    description: description,
    bookcase: bookcaseId,
  });
  res.status(200).json({
    success: true,
    message: "Cập nhật giá sách thành công!",
  });
});

module.exports.deleteBookshelf = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  let bookshelf = await bookshelfModel.findById(id);
  if (!bookshelf) throw new BusinessException(500, "Giá sách không tồn tại!");
  await bookshelfModel.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Xoá giá sách thành công!",
  });
});

module.exports.addBookToBookshelf = catchAsyncError(async (req, res, next) => {
  const {id} = req.params;
  const {bookshelfId, books} = req.body;
  if (!id || id != bookshelfId) throw new BusinessException(500, "Dữ liệu không hợp lệ");
  let bookshelf = await bookshelfModel.findById(id);
  if (!bookshelf) throw new BusinessException(500, "Giá sách không tồn tại!");
  bookshelf.books = [];
  books.forEach(element => {
    bookshelf.books.push({
      book: element.bookId,
      code: element.code,
      quantity: element.quantity
    })
  });
  await bookshelf.save();
  res.status(200).json({
    success: true,
    message: "Thêm sách vào giá sách thành công!",
  });
})
