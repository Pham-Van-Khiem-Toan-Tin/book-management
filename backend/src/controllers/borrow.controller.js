const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const borrowModel = require("../models/borrow.model");
const BusinessException = require("../utils/error.util");

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

module.exports.createBorrowOffline = catchAsyncError(async (req, res, next) => {
  const {userId, email, phone, borrows } = req.body;
  if(!userId || !email || !phone || !borrows || !Array.isArray(borrows)) throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const borrowRecords = borrows.map((item) =>{
    return ({
      book: item.book,
      code: item.code,
      quantity: item.quantity,
      library: item.library,
      borrower: {
        user: userId,
        phone: phone,
        email: email,
      },
      type: "offline",
      borrow_date: new Date(),
      return_date: item.returnDate,
      status: "borrowed",
    });
  });
  await borrowModel.insertMany(borrowRecords);
  res.status(200).json({
    success: true,
    message: "Các bản ghi mượn sách đã được tạo thành công",
  });
});

module.exports.createBorrowOnline = catchAsyncError(async (req, res, next) => {
  const  {userId, email, phone, borrows, returnDate, address } = req.body;
  const borrowRecords = borrows.map((item) =>{
    return ({
      book: item.book,
      code: item.code,
      quantity: item.quantity,
      library: item.library,
      borrower: {
        user: userId,
        phone: phone,
        email: email,
      },
      type: "online",
      borrow_date: new Date(),
      return_date: returnDate,
      status: "pending",
      shipping: {
        address: address,
        pendingAt: new Date()
      }
    });
  });
  await borrowModel.insertMany(borrowRecords);
  res.status(200).json({
    success: true,
    message: "Đơn mượn đang được xử lí. Vui lòng theo dõi trạng thái đơn mượn!",
  });
})
