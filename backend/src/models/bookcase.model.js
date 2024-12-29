const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const bookcaseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Bookcase code is not valid"],
      minLength: [1, "Bookcase code should have more than 2 characters"],
      maxLength: [32, "Bookcase code can not exceed 32 characters"],
    },
    name: {
      type: String,
      required: [true, "Bookcase name is not valid"],
      unique: true,
      minLength: [2, "Bookcase name should have more than 2 characters"],
      maxLength: [32, "Bookcase name can not exceed 32 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is not valid"],
      minLength: [2, "Description should have more than 2 characters"],
    },
    library: {
      type: ObjectId,
      ref: "libraries",
      required: true,
    },
  },
  { timestamps: true }
);

const bookcaseModel = mongoose.model("bookcases", bookcaseSchema);
module.exports = bookcaseModel;
