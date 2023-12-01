  const mongoose = require("mongoose");
  const user = require("./userModel");

  const updatesModel = new mongoose.Schema(
      {
          title:{
              type: String,
              trim:true,
              required:[true, "Title  field must not be empty"],
              minLength:[2,"Title field must have atleast 2 characters"]
            },
          desc: {
              type: String,
              trim:true,
              required:[true, "Description field must not be empty"],
              minLength:[10,"Description field must have atleast 10 characters"]
            },
          user:{type: mongoose.Schema.Types.ObjectId, ref:"user",},

      },
      {
          timestamps:true,
      }
  )

  module.exports = mongoose.model("updates",updatesModel);