const mongoose = require("mongoose");

const taskModel = new mongoose.Schema(
    {
        title:String,
        desc: String,
        date:Date,
        user:{type: mongoose.Schema.Types.ObjectId, ref:"user"},
    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("task",taskModel);