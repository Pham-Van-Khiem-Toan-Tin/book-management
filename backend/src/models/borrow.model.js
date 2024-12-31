const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const validator = require("validator");
const borrowSchema = new mongoose.Schema(
  {
    book: {
      type: ObjectId,
      ref: "books",
      required: true,
    },
    code: {
      type: String,
      required: true,
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
      user: {
        type: ObjectId,
        ref: "users",
        required: true,
      },
      phone: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, "Enter phone number"],
      },
      email: {
        type: String,
        required: true,
        validated: [validator.isEmail, "Enter email"]
      }
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
      enum: ["pending", "borrowed", "returned", "shipping", "failed"],
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
      status: {
        status_value: {
          type: String,
          enum: ["pending", "shipping", "delivered", "failed"],
          default: "pending",
        },
        failReason: { type: String },
        pendingAt: { type: Date },
        shippingAt: { type: Date },
        deliveredAt: { type: Date },
        failedAt: { type: Date },
      },
    },
  },
  { timestamps: true }
);

const borrowModel = mongoose.model("borrows", borrowSchema);
module.exports = borrowModel;
