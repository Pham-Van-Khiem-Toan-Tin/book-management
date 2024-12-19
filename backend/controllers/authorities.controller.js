const catchAsyncError = require("../middlewares/catchAsyncError.middleware");
const BusinessException = require("../middlewares/error.middleware");
const functionModel = require("../models/function.model");
const roleModel = require("../models/role.model");
const subFunctionModel = require("../models/subfucntion.model");

//role

module.exports.addRole = catchAsyncError(async (req, res, next) => {
  const { id, name, order, description } = req.body;
  const existsRole = await roleModel.exists({ _id: id });
  if (existsRole)
    throw new BusinessException(500, "The authority already exists!");
  await roleModel.create({
    _id: id,
    name: name,
    order: order,
    description: description,
  });
  res.status(200).json({
    success: true,
    message: "New permission added successfully!",
  });
});

module.exports.editRole = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  const { name, description } = req.body;
  const role = await roleModel.findById(id);
  if (!role) throw new BusinessException(500, "Authority does not exist!");
  role.name = name;
  role.description = description;
  await role.save();
  res.status(200).json({
    success: true,
    message: "Permissions updated successfully!",
  });
});

module.exports.addFunctionsListToRole = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.query;
    const { functions } = req.body;
    if (!Array.isArray(functions))
      throw new BusinessException(500, "Invalid data.");
    const role = await roleModel.findById(id);
    if (!role) throw new BusinessException(500, "Authority does not exist!");
    functions.forEach((item) => {
      if (!role.functions.includes(item)) role.functions.push(item);
    });
    await role.save();
    res.status(200).json({
      success: true,
      message: "Permissions updated successfully!",
    });
  }
);

//function

module.exports.addFunction = catchAsyncError(async (req, res, next) => {
  const { id, name, description } = req.body;
  const existsFunction = await functionModel.exists({ _id: id });
  if (existsFunction)
    throw new BusinessException(500, "The Function already exists!");
  await functionModel.create({
    _id: id,
    name: name,
    description: description,
  });
  res.status(200).json({
    success: true,
    message: "New function added successfully!",
  });
});

module.exports.editFunction = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  const { name, description } = req.body;
  const functionEdit = await functionModel.findById(id);
  if (!functionEdit) throw new BusinessException(500, "Function does not exist!");
  functionEdit.name = name;
  functionEdit.description = description;
  await functionEdit.save();
  res.status(200).json({
    success: true,
    message: "Function update successful!",
  });
});

module.exports.addSubFunctionsToFunction = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.query;
    const { subfunctions } = req.body;
    if (!Array.isArray(subfunctions))
      throw new BusinessException(500, "Invalid data.");
    const functionEdit = await functionModel.findById(id);
    if (!functionEdit) throw new BusinessException(500, "Function does not exist!");
    subfunctions.forEach((item) => {
      if (!functionEdit.subFunctions.includes(item)) functionEdit.subFunctions.push(item);
    });
    await functionEdit.save();
    res.status(200).json({
      success: true,
      message: "Function update successful!",
    });
  }
);

//subFunction

module.exports.addSubFunction = catchAsyncError(async (req, res, next) => {
  const { id, name, description } = req.body;
  const existsSubFunction = await subFunctionModel.exists({ _id: id });
  if (existsSubFunction)
    throw new BusinessException(500, "The Function already exists!");
  await subFunctionModel.create({
    _id: id,
    name: name,
    description: description,
  });
  res.status(200).json({
    success: true,
    message: "New function added successfully!",
  });
});
