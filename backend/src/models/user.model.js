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
        phone: {
            type: String,
            unique: true,
            validate: [validator.isMobilePhone, "Please Enter a valid Phone Number"]
        },
        library: {
            type: ObjectId,
            ref: "libraries"
        },
        avatar: {
            type: mongoose.Schema.Types.Mixed,
            validate: {
                validator: function (v) {
                    return (
                        typeof v === "string" ||
                        (typeof v === "object" && v !== null && "url" in v && "public_id" in v)
                    );
                },
                message: "Avatar must be either a string or an object with `url` and `public_id` fields.",
            },
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