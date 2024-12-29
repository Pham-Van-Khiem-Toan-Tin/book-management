const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const cloudinary = require("cloudinary");
const bookModel = require("../models/book.model");

module.exports.createBook = catchAsyncError(async (req, res, next) => {
  const { title, author, description, bookcase, images, type, publisher } = req.body;
  if (!title || !author || !description || !bookcase || !images)
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const exists = await bookModel.exists({ title: title });
  if (exists) throw new BusinessException(500, "Sách đã tồn tại!");
  let result;
  try {
    result = await cloudinary.v2.uploader.upload(images.src, {
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
    type: type,
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
    .find({ name: { $regex: regexKeyword } })
    .select("_id title author image type createdAt")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await bookModel.countDocuments({
    name: { $regex: regexKeyword },
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
