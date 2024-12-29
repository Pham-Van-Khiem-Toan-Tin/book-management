const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is not valid"],
      minLength: [2, "Title should have more than 2 characters"],
      maxLength: [32, "Title can not exceed 32 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is not valid"],
      minLength: [2, "Author should have more than 2 characters"],
      maxLength: [32, "Author can not exceed 32 characters"],
    },
    publisher: {
      type: String,
      required: [true, "Publisher is not valid"],
      minLength: [2, "Publisher should have more than 2 characters"],
      maxLength: [32, "Publisher can not exceed 32 characters"],
    },
    image: {
      public_id: {
        type: String,
        required: [true, "Image is not valid"],
      },
      url: {
        type: String,
        required: [true, "Image is not valid"],
      },
    },
    type: {
      type: String,
      required: [true, "Type is not valid"],
      enum: ["novel", "comic"]
    },
    description: {
      type: String,
      required: [true, "Description is not valid"],
      minLength: [2, "Description should have more than 2 characters"],
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model("books", bookSchema);
module.exports = bookModel;