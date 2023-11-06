const mongoose = require("mongoose");
const user = require("./userModel");

const updatesModel = new mongoose.Schema(
    {
        title:String,
        desc: String,
        user:{type: mongoose.Schema.Types.ObjectId, ref:"user",},

    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("updates",updatesModel);