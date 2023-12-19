const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema({
  passwordResetToken: {
    type: Number,
    default: "0",
  },
  username: {
    type: String,
    // trim: true,
    // unique: true,
    // required: [true, "Username field must not be empty"],
    // minLength: [4, "Username field must have atleast 4 characters"]
  },
  name: {
    type: String,
    // trim: true,
    // required: [true, "Name field must not be empty"],
    // minLength: [2, "Name field must have atleast 2 characters"]
  },
  password: String,
  email: {
    type: String,
    // trim: true,
    // lowercase: true,
    // unique: true,
    // required: [true, "Email address is required"],
    // match: [
    //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //   "Invalid email address",
    // ],
  },
  avatar: {
    type: String,
    // default: "default.avif",
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tasks" }],
  updates: [
    { type: mongoose.Schema.Types.ObjectId, ref: "updates" }
  ],

  time: [{ type: mongoose.Schema.Types.ObjectId, ref: "time" }],


});

userModel.plugin(plm);
const user = mongoose.model("user", userModel);

module.exports = user;
