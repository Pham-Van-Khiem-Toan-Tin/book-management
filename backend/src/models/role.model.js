const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const roleSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "Role id is not valid"],
            minLength: [2, "Role id should have more than 2 characters"],
            maxLength: [32, "Role id can not exceed 32 characters"],
        },
        order: {
            type: Number,
            required: true
        },
        functions: [{
            type: String,
            ref: "functions",
        }],
        name: {
            type: String,
            required: [true, "Role name is not valid"],
            minLength: [2, "Role name should have more than 2 characters"],
            maxLength: [32, "Role name can not exceed 32 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is not valid"],
            minLength: [2, "Description should have more than 2 characters"],
        }
    },
    {
        timestamps: true
    }
);

const roleModel = mongoose.model("roles", roleSchema);

module.exports = roleModel;