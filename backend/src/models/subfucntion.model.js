const mongoose = require("mongoose");

const subFunctionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "SubFunction id is not valid"],
            minLength: [2, "SubFunction id should have more than 2 characters"],
            maxLength: [32, "SubFunction id can not exceed 32 characters"],
        },
        name: {
            type: String,
            required: [true, "SubFunction name is not valid"],
            minLength: [2, "SubFunction name should have more than 2 characters"],
            maxLength: [32, "SubFunction name can not exceed 32 characters"],
        },
        authorities: [{
            type: String,
            ref: "roles",
        }],
        description: {
            type: String,
            required: [true, "Description is not valid"],
            minLength: [2, "Description should have more than 2 characters"],
        }
    },
    {timestamps: true}
);

const subFunctionModel = mongoose.model("subfunctions", subFunctionSchema);

module.exports = subFunctionModel;