var express = require('express');
var router = express.Router();
const Admin = require("../models/adminModel")
const User = require("../models/userModel"); 
// -----------Passport----------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use('admin', new LocalStrategy(Admin.authenticate()));
// ----------------------------------------------


/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render("admin/adminlogin");
});

router.post("/login", passport.authenticate('admin',{
  failureRedirect:"/admin",
  successRedirect:"/admin/users",
}),function (req, res) {
});

// --------------------------register------------------------
router.get('/register', function(req, res, next) {
  try {
  res.render("admin/adminregister");
  } catch (error) {
    console.log("thiss is "+error);
  }
  
});

router.post("/register", async function (req, res) {
  try {
    const {username , name , password ,role ,email} = req.body;
    const admin = await Admin.register({username,name,role,email},password);
    await res.render("admin/adminlogin");

  } catch (error) {
        res.send(error.message);
  }
});
// ---------------------------------------------------------------

router.get('/homepage', function(req, res, next) {
  res.render("admin/homepage");
});



// -----------------------------------------------------------------
router.get('/users', async (req, res) => {
  try {
      const allUsers = await User.find({},).exec();
      var a = [...allUsers];
      a.forEach(function(e){
        console.log("tisss is resp"+e);
      })
      res.send(a)
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
// --------------------------------------------------------------------


module.exports = router;
