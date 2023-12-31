const mongoose = require("mongoose");

const taskModel = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title  field must not be empty"],
      minLength: [2, "Title field must have atleast 2 characters"]
    },
    desc: {
      type: String,
      trim: true,
      required: [true, "Description field must not be empty"],
      minLength: [10, "Description field must have atleast 10 characters"]
    },
    status:{
      type:Boolean,
      default:false,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("tasks", taskModel);