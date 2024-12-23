const catchAsyncError = require("../middlewares/catchAsyncError.middleware");


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
        totalPages: Math.ceil(total/limit)
      }
    });
})