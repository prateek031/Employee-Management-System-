const mongoose = require("mongoose");

const timeModel = new mongoose.Schema(
    {
        date: String,
        time: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("time", timeModel);