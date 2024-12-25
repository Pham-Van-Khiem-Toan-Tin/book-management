const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
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
    image: {
      type: String,
      required: [true, "Image is not valid"],
    },
    description: {
      type: String,
      required: [true, "Description is not valid"],
      minLength: [2, "Description should have more than 2 characters"],
    },
    location: [
      {
        library: {
          type: ObjectId,
          ref: "libraries",
          required: true,
        },
        bookshelf: {
          type: ObjectId,
          ref: "bookshelves",
          required: true,
        },
        bookcase: {
          type: ObjectId,
          ref: "bookcases",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        }
      },
    ],
  },
  { timestamps: true }
);

const bookModel = mongoose.model("books", bookSchema);
module.exports = bookModel;