const mongoose = require("mongoose"); 
mongoose.set("strictQuery", false);

// mongoose.connect("mongodb+srv://prateek_31:prteek2123@web-integratorz-ems.b4qq5bi.mongodb.net/")
//   .then(function () {
//     console.log("App Connected to the Database.");

//   })

const { MongoClient } = require("mongodb").MongoClient;

const username = encodeURIComponent("prateek_31");
const password = encodeURIComponent("prteek2123");
const uri =
  `mongodb://${username}:${password}@ac-gv778bu-shard-00-00.b4qq5bi.mongodb.net:27017,ac-gv778bu-shard-00-01.b4qq5bi.mongodb.net:27017,ac-gv778bu-shard-00-02.b4qq5bi.mongodb.net:27017/?ssl=true&replicaSet=atlas-nknmue-shard-0&authSource=admin&retryWrites=true&w=majority`;
  
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
