const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const librarySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Library name is not valid"],
            unique: true,
            minLength: [2, "Library name should have more than 2 characters"],
            maxLength: [32, "Library name can not exceed 32 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is not valid"],
            minLength: [2, "Description should have more than 2 characters"],
        },
        location: {
            type: String,
            required: [true, "Location is not valid"]
        },
    },
    {
        timestamps: true
    }
);

const libraryModel = mongoose.model("libraries", librarySchema);

module.exports = libraryModel;