const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const bookshelfSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Bookshelf code is not valid"],
      minLength: [2, "Bookshelf code should have more than 2 characters"],
      maxLength: [32, "Bookshelf code can not exceed 32 characters"],
    },
    name: {
      type: String,
      required: [true, "Bookshelf name is not valid"],
      unique: true,
      minLength: [2, "Bookshelf name should have more than 2 characters"],
      maxLength: [32, "Bookshelf name can not exceed 32 characters"],
    },
    category: {
      type: ObjectId,
      ref: "categories",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is not valid"],
      minLength: [2, "Description should have more than 2 characters"],
    },
    bookcase: {
      type: ObjectId,
      ref: "bookcases",
      required: true,
    },
    books: [
      {
        book: {
          type: ObjectId,
          ref: "books",
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

const bookshelfModel = mongoose.model("bookshelves", bookshelfSchema);
module.exports = bookshelfModel;
