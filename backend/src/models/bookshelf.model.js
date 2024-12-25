const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const bookshelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Bookshelf name is not valid"],
        unique: true,
        minLength: [2, "Bookshelf name should have more than 2 characters"],
        maxLength: [32, "Bookshelf name can not exceed 32 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is not valid"],
        minLength: [2, "Description should have more than 2 characters"],
    },
    bookcase: {
        id: {
            type: ObjectId,
            ref: "bookcases",
            required: true,
        },
    },

}, {timestamps: true});

const bookshelfModel = mongoose.model("bookshelves", bookshelfSchema);
module.exports = bookshelfModel;