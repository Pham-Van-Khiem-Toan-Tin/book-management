const { default: mongoose } = require("mongoose");


const librarySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is not valid"],
            unique: true,
            minLength: [2, "Category name should have more than 2 characters"],
            maxLength: [32, "Category name can not exceed 32 characters"],
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
        
    }
);

const libraryModel = mongoose.model("libraries", librarySchema);

module.exports = libraryModel;