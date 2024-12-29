const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const borrowSchema = new mongoose.Schema(
  {
    book: {
      id: {
        type: ObjectId,
        ref: "books",
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    library: {
      type: ObjectId,
      ref: "libraries",
      required: true,
    },
    borrower: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["offline", "online"],
    },
    borrow_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    return_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned", "shipping", "failed"],
      required: true,
      default: "borrowed",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: { type: String },
    shipping: {
      address: { type: String },
      phone: { type: String },
      status: {
        type: String,
        enum: ["pending", "shipping", "delivered", "failed"],
        default: "pending",
        failReason: { type: String },
      },
    },
  },
  { timestamps: true }
);

const borrowModel = mongoose.model("borrows", borrowSchema);
module.exports = borrowModel;
