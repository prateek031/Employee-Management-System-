var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/userModel")
const Tasks = require("../models/taskModel");
const Updates = require("../models/updateModel")
// ------------------------Passport------------------------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use('local', new LocalStrategy(User.authenticate()));
// ---------------------------------------------------------------

// -----------------------------Register------------------------------
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

router.get("/todays_updates",isLoggedIn,async function (req, res) {
  const updates = await Updates.find({ user: req.user._id });
  res.render("todayupdate", { updates: updates, user: req.user });
});
// -------------------------------------------------------------------
router.get("/addupdate",isLoggedIn, function (req, res) {
  res.render("addupdate");
});

router.post("/addupdate",isLoggedIn,async function(req,res,next){
  try {
    const updates = new Updates(req.body);
    updates.user= req.user._id ;
    req.user.updates.push(updates._id);
    await updates.save();
    // await req.user.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { updates: updates._id } }
    );
    res.redirect("/todays_updates?success=true");

 
  } catch (error) {
    res.send('Error: ' + error);
  }
})

module.exports = router;
