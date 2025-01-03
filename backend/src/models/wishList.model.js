const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "users",
      required: [true, "User is not valid"],
    },
    books: [
      {
        book: {
          type: ObjectId,
          ref: "books",
          required: [true, "Book is not valid"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is not valid"],
          min: [1, "Quantity can not be less than 1"],
        },
      },
    ],
  },
  { timestamps: true }
);

const wishListModel = mongoose.model("wishLists", wishListSchema);
module.exports = wishListModel;