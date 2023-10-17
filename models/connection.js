const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

// mongoose.connect("mongodb+srv://prateek_31:prteek2123@web-integratorz-ems.b4qq5bi.mongodb.net/")
//   .then(function () {
//     console.log("App Connected to the Database.");

//   })


const { MongoClient } = require("mongodb");

const username = encodeURIComponent("prateek_31");
const password = encodeURIComponent("prteek2123");
// Replace the uri string with your connection string.
const uri ="mongodb+srv://${username}:${password}@web-integratorz-ems.b4qq5bi.mongodb.net/main"; 
mongoose.connect(uri,{
  useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(()=>{
  console.log("connected");
}).catch((err)=>{
  console.error(err.stack)
  process.exit(1)
})