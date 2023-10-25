var express = require("express");
var router = express.Router();
const User = require("../models/userModel")
const Tasks = require("../models/tasksModel");
// -----------Passport----------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
// ----------------------------------------------

// -------------------register------------------------
router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", async function (req, res) {
  try {
    const {username , name , password , email} = req.body;
    const user = await User.register({username,name,email},password);
    res.redirect("/");
  } catch (error) {
        res.send(error.message);
  }
});
// -----------------------------------------------------------------


// --------------------------login----------------------------------
router.get("/", function (req, res) {
  res.render("login");
});
router.post("/login", passport.authenticate("local",{
  failureRedirect:"/",
  successRedirect:"/dashboard",
}),function (req, res) {
});
// ------------------------------------------------------------------



// --------------------------islogged_in------------------------------
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
// -----------------------------------------------------------------------


// =================================logout=================================
router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
router.get("/dashboard",isLoggedIn, function (req, res) {
  res.render("dashboard",{user: req.user});
});
router.get("/profile",isLoggedIn, function (req, res) {
  res.render("profile",{user: req.user});
});

router.get("/todays_task",isLoggedIn,function (req, res) {
  res.render("task",{user: req.user});
});

router.get("/time_tracking",isLoggedIn, function (req, res) {
  res.render("time");
});

router.get("/todays_updates",isLoggedIn, function (req, res) {
  res.render("updates");
});
router.get("/addtask",isLoggedIn, function (req, res) {
  res.render("addtask");
});



router.post("/addtask",isLoggedIn,async function(req,res,next){
  try {
    const tasks = new Tasks(req.body);
    tasks.user= req.user._id ;
    req.user.tasks.push(tasks._id);
    await tasks.save();
    await req.user.save();
    res.redirect("/todays_task");
  } catch (error) {
    res.send(error);
  }
})

module.exports = router;
