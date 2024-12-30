const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Schema.ObjectId;
require("dotenv").config();

const userSchema = new mongoose.Schema(
    {
        oauth_id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["facebook", "google"]
        },
        name: {
            type: String,
            required: [true, "Enter your name"],
            minLength: [2, "Name should have more than 2 characters"],
            maxLength: [32, "Name can not exceed 32 characters"],
        },
        lock: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"]
        },
        library: {
            type: ObjectId,
            ref: "libraries"
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            ref: "roles",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;