const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is not valid"],
            unique: true,
            minLength: [2, "Category name should have more than 2 characters"],
            maxLength: [32, "Category name can not exceed 32 characters"],
        },
        parent_id: {
            type: ObjectId,
            ref: "categories",
            default: null
        },
        description: {
            type: String,
            required: [true, "Description is not valid"],
            minLength: [2, "Description should have more than 2 characters"],
        }
    },
    {timestamps: true}
);

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;