const mongoose = require("mongoose");

const functionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "Function id is not valid"],
            minLength: [2, "Function id should have more than 2 characters"],
            maxLength: [32, "Function id can not exceed 32 characters"],
        },
        name: {
            type: String,
            required: [true, "Function name is not valid"],
            minLength: [2, "Function name should have more than 2 characters"],
            maxLength: [32, "Function name can not exceed 32 characters"],
        },
        subFunctions: [{
            type: String,
            ref: "subfunctions",
        }],
        description: {
            type: String,
            required: [true, "Description is not valid"],
            minLength: [2, "Description should have more than 2 characters"],
        }
    },
    {timestamps: true}
);

const functionModel = mongoose.model("functions", functionSchema);

module.exports = functionModel;