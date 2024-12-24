const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const libraryModel = require("../models/library.model");
const BusinessException = require("../utils/error.util");


module.exports.search = catchAsyncError(async (req, res, next) => {
    const { keyword, page = 1, limit = 10 } = req.query;
    const regexKeyword = new RegExp(keyword, "i");
    const skip = (page - 1) * limit;
    let list = await libraryModel
      .find({ name: { $regex: regexKeyword } })
      .select("_id name location createdAt")
      .skip(skip)
      .limit(parseInt(limit));
    const total = await libraryModel.countDocuments({
      name: { $regex: regexKeyword },
    });
    if (!list) list = [];
    res.status(200).json({
      libraries: list,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total/limit)
      }
    });
});

module.exports.viewLibrary = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) throw new BusinessException(500, "Invalid data");
    let library = await libraryModel.findById(id).select("_id name description location createdAt");
    if (!library) throw new BusinessException(500, "Library does not exist!");
    res.status(200).json({
      library: library,
    });
});

module.exports.addLibrary = catchAsyncError(async (req, res, next) => {
    const { name, description, location } = req.body;
    if (!name || !description || !location) throw new BusinessException(500, "Invalid data");
    const exists = await libraryModel.exists({ name: name });
    if (exists)
      throw new BusinessException(
        500,
        "The library that already exists!"
      );
    await libraryModel.create({
      name: name,
      description: description,
      location: location
    });
    res.status(200).json({
      success: true,
      message: "Library added successfully!",
    });
});

module.exports.editLibrary = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, location } = req.body;
    if (!id || !name || !description || !location) throw new BusinessException(500, "Invalid data");
    const exists = await libraryModel.exists({ _id: id });
    if (!exists)
      throw new BusinessException(
        500,
        "The library does not exist!");
    await libraryModel.findByIdAndUpdate(id, {
      name: name,
      description: description,
      location: location
    });
    res.status(200).json({
      success: true,
      message: "Library updated successfully!",
    });
});

module.exports.deleteLibrary = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) throw new BusinessException(500, "Invalid data");
    const exists = await libraryModel.exists({ _id: id });
    if (!exists)
      throw new BusinessException(
        500,
        "The library does not exist!");
    await libraryModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Library deleted successfully!",
    });
});