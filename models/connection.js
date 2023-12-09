const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const { MongoClient } = require("mongodb").MongoClient;


const uri = process.env.URL;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
