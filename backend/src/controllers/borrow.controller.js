const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const borrowModel = require("../models/borrow.model");

module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword, "i");
  const skip = (page - 1) * limit;
  let list = await borrowModel
    .find({ "book.code": { $regex: regexKeyword } })
    .select(
      "_id book quantity library borrower type borrow_date return_date return_date status"
    )
    .populate("library", "name")
    .populate("borrower", "name")
    .populate("book.id", "name")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await borrowModel.countDocuments({
    "book.code": { $regex: regexKeyword },
  });
  if (!list) list = [];
  res.status(200).json({
    borrows: list,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

module.exports.createBorrow = catchAsyncError(async (req, res, next) => {
  const { borrows } = req.body;
  
});
