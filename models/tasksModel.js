const mongoose = require("mongoose");

const tasksModel = new mongoose.Schema(
    {
        title:String,
        description: String,
        user:{type: mongoose.Schema.Types.ObjectId, ref:"user"},
    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("tasks",tasksModel);