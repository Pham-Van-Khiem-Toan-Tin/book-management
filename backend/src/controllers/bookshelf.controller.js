const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const bookshelfModel = require("../models/bookshelf.model");

module.exports.search = catchAsyncError(async (req, res, next) => {
    const { keyword, page = 1, limit = 10 } = req.query;
    const regexKeyword = new RegExp(keyword, "i");
    const skip = (page - 1) * limit;
    let list = await bookshelfModel
      .find({ name: { $regex: regexKeyword } })
      .select("_id name description bookcase createdAt")
      .skip(skip)
      .limit(parseInt(limit));
    const total = await bookshelfModel.countDocuments({
      name: { $regex: regexKeyword },
    });
    if (!list) list = [];
    res.status(200).json({
      bookcases: list,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total/limit)
      }
    });
});

module.exports.viewBookshelf = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) throw new BusinessException(500, "Invalid data");
    let bookshelf = await bookshelfModel.findById(id).select("_id name description library createdAt");
    if (!bookshelf) throw new BusinessException(500, "Bookshelf does not exist!");
    res.status(200).json({
      bookshelf: bookshelf,
    });
});

module.exports.addBookshelf = catchAsyncError(async (req, res, next) => {
    const { name, description, bookcase } = req.body;
    if (!name || !description || !library) throw new BusinessException(500, "Invalid data");
    const exists = await bookshelfModel.exists({ name: name });
    if (exists)
      throw new BusinessException(
        500,
        "The bookshelf that already exists!"
      );
    await bookshelfModel.create({
      name: name,
      description: description,
      bookcase: bookcase
    });
    res.status(200).json({
      success: true,
      message: "Bookshelf added successfully!",
    });
});

module.exports.updateBookshelf = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, bookcase } = req.body;
    if (!id || !name || !description || !bookcase) throw new BusinessException(500, "Invalid data");
    let bookshelf = await bookshelfModel.findById(id);
    if (!bookshelf) throw new BusinessException(500, "Bookshelf does not exist!");
    await bookshelfModel.findByIdAndUpdate(id, {
      name: name,
      description: description,
      bookcase: bookcase
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