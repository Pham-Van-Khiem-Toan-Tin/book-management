const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const bookshelfModel = require("../models/bookshelf.model");
const borrowModel = require("../models/borrow.model");
const BusinessException = require("../utils/error.util");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports.search = catchAsyncError(async (req, res, next) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const regexKeyword = new RegExp(keyword ?? "", "i");
  const skip = (page - 1) * limit;
  let list = await borrowModel
    .find({ "code": { $regex: regexKeyword } })
    .select(
      "_id book code quantity library borrower type borrow_date return_date return_date status"
    )
    .populate("library", "name")
    .populate("borrower.user", "name")
    .populate("book", "title")
    .skip(skip)
    .limit(parseInt(limit));
  const total = await borrowModel.countDocuments({
    "code": { $regex: regexKeyword },
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
  const { userId, email, phone, books } = req.body;

  if (!userId || !email || !phone || !books || !Array.isArray(books))
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const currentDate = new Date();

  books.forEach((item) => {
    if (
      !item.id ||
      !item.code ||
      !item.quantity ||
      !item.returnDate ||
      currentDate > item.returnDate
    ) {
      throw new BusinessException(500, "Dữ liệu không hợp lệ!");
    }
  });
  const bookBorrowed = await borrowModel
    .find({ "borrower.user": userId, status: { $in: ["pending", "borrowed", "shipping"] } })
    .populate("book", "name type");
  let quantityComic = 0;
  let quantityTextbook = 0;
  bookBorrowed.forEach((item) => {
    if (item.book.type === "comic") quantityComic += item.quantity;
    else if (item.book.type === "novel") quantityTextbook += item.quantity;
    if (quantityComic >= 3 || quantityTextbook >= 6) {
      throw new BusinessException(500, "Số lượng sách mượn đã đạt giới hạn!");
    }
  });
  const bookIds = books.map((item) => ({
    id: ObjectId.createFromHexString(item.id),
    code: item.code,
    bookshelf: ObjectId.createFromHexString(item.bookshelf),
    library: ObjectId.createFromHexString(item.library),
    quantity: item.quantity,
  }));

  const inventoryArray = await bookshelfModel.aggregate([
    {
      $unwind: "$books",
    },
    {
      $lookup: {
        from: "books",
        localField: "books.book",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $lookup: {
        from: "bookcases",
        localField: "bookcase",
        foreignField: "_id",
        as: "bookcaseDetails",
      },
    },
    {
      $unwind: "$bookcaseDetails",
    },
    {
      $match: {
        $and: [
          {
            $expr: {
              $in: [
                {
                  id: "$books.book",
                  code: "$books.code",
                  bookshelf: "$_id",
                  library: "$bookcaseDetails.library",
                },
                bookIds.map((item) => ({
                  id: item.id,
                  code: item.code,
                  bookshelf: item.bookshelf,
                  library: item.library,
                })),
              ],
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        bookshelfId: "$_id",
        bookId: "$bookDetails._id",
        libraryId: "$bookcaseDetails.library",
        code: "$books.code",
        type: "$bookDetails.type",
        quantity: "$books.quantity",
        requestedQuantity: {
          $let: {
            vars: {
              requestedBook: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: bookIds,
                      as: "book",
                      cond: {
                        $and: [
                          {
                            $eq: ["$$book.id", "$books.book"],
                          },
                          {
                            $eq: ["$$book.code", "$books.code"],
                          }
                        ]
                      },
                    },
                  },
                  0,
                ],
              },
            },
            in: "$$requestedBook.quantity",
          },
        },
      },
    },
  ]);
  if (!inventoryArray || inventoryArray.length != bookIds.length)
    throw new BusinessException(500, "Số lượng sách trong kho không đủ!");
  inventoryArray.forEach((item) => {
    if (item.quantity < item.requestedQuantity)
      throw new BusinessException(500, "Số lượng sách trong kho không đủ!");
  });
  const bulkOperations = inventoryArray.map((item) => ({
    updateOne: {
      filter: {
        _id: item.bookshelfId,
        "books.book": item.bookId,
        "books.code": item.code,
      },
      update: {
        $inc: {
          "books.$.quantity": -1 * item.requestedQuantity,
        },
      },
    },
  }));
  await bookshelfModel.bulkWrite(bulkOperations);
  const borrowRecords = books.map((item) => {
    return {
      book: item.id,
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
      approvalStatus: "approved",
    };
  });

  await borrowModel.insertMany(borrowRecords);
  res.status(200).json({
    success: true,
    message: "Các bản ghi mượn sách đã được tạo thành công",
  });
});

module.exports.createBorrowOnline = catchAsyncError(async (req, res, next) => {
  const { email, phone, borrows, returnDate, address } = req.body;
  if (!userId || !email || !phone || !borrows || !Array.isArray(borrows))
    throw new BusinessException(500, "Dữ liệu không hợp lệ!");
  const borrowRecords = borrows.map((item) => {
    return {
      book: item.book,
      code: item.code,
      quantity: item.quantity,
      library: item.library,
      borrower: {
        user: req.user,
        phone: phone,
        email: email,
      },
      type: "online",
      borrow_date: new Date(),
      return_date: returnDate,
      status: "pending",
      shipping: {
        address: address,
        pendingAt: new Date(),
      },
    };
  });
  await borrowModel.insertMany(borrowRecords);
  res.status(200).json({
    success: true,
    message: "Đơn mượn đang được xử lí. Vui lòng theo dõi trạng thái đơn mượn!",
  });
});
