const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const cloudinary = require("cloudinary");
const bookModel = require("../models/book.model");
const BusinessException = require("../utils/error.util");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports.createBook = catchAsyncError(async (req, res, next) => {
  const { title, author, description, type, publisher, categories } = req.body;
  const image = req.files.image;
  console.log(image);

  console.log({ title, author, description, image, type, publisher });

  if (!title || !author || !description || !type || !publisher || !categories)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  if (!req.files || !req.files.image)
    throw new BusinessException(500, "Vui lòng tải lên ảnh sách!");

  const exists = await bookModel.exists({ title: title });
  if (exists) throw new BusinessException(500, "Sách đã tồn tại!");
  let result;
  try {
    result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      folder: "books",
    });
  } catch (error) {
    throw new BusinessException(
      500,
      "Không thể tạo mới sách. Vui lòng thử lại sau!"
    );
  }
  await bookModel.create({
    title: title,
    author: author,
    description: description,
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
    publisher: publisher,
    categories: JSON.parse(categories),
    type: type,
  });
  fs.unlink(image.tempFilePath, (err) => {
    if (err) console.error("Error deleting temp file:", err);
  });
  res.status(200).json({
    success: true,
    message: "Thêm mới sách thành công!",
  });
});

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await bookModel
    .find({ title: { $regex: regexKeyword } })
    .select("_id title author publisher image type createdAt")
    .populate("categories", "_id name")
    .skip(skip)
    .limit(parseInt(limit));

  const total = await bookModel.countDocuments({
    title: { $regex: regexKeyword },
  });
  if (!list) list = [];
  res.status(200).json({
    books: list,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.selectBook = catchAsyncError(async (req, res, next) => {
  const { keyword, excluded, categoryId } = req.query;
  console.log(categoryId);

  const excludedIds = excluded ? excluded.split(",") : [];
  const regexKeyword = new RegExp(keyword, "i");
  const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
  let list = await bookModel
    .find({
      _id: { $nin: excludedIds },
      title: { $regex: regexKeyword },
      categories: { $in: [categoryObjectId] },
    })
    .select("_id title");
  if (!list) list = [];
  res.status(200).json({
    books: list,
  });
});

module.exports.viewBook = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  let book = await bookModel
    .findById(id)
    .select(
      "_id title author publisher image type description categories createdAt"
    )
    .populate("categories", "_id name");
  if (!book) throw new BusinessException(500, "Sách không tồn tại!");
  res.status(200).json({
    book: book,
  });
});

module.exports.updateBook = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { _id, title, author, description, type, publisher, categories } =
    req.body;
  const image = req.files.image;
  if (
    !_id ||
    !title ||
    !author ||
    !description ||
    !type ||
    !publisher ||
    !categories ||
    _id !== id
  )
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  let book = await bookModel.findById(id);
  if (!book) throw new BusinessException(500, "Sách không tồn tại!");
  let newImage = book.image;
  if (req.files && req.files.image) {
    try {
      await cloudinary.v2.uploader.destroy(book.image.public_id);
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
        folder: "books",
      });
      newImage = {
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
        "Không thể cập nhật sách. Vui lòng thử lại sau!"
      );
    }
  }
  await bookModel.findByIdAndUpdate(id, {
    title: title,
    categories: JSON.parse(categories),
    author: author,
    description: description,
    publisher: publisher,
    type: type,
    image: newImage,
  });

  res.status(200).json({
    success: true,
    message: "Cập nhật sách thành công!",
  });
});
