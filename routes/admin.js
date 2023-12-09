var express = require("express");
var router = express.Router();
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Updates = require("../models/updateModel");
const Task = require("../models/taskModel");
const Time = require("../models/timeModel");
const mongoose = require("mongoose");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
// --------------------------------------------------Passport-----------------------------------------------------------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { log } = require("console");
passport.use("admin", new LocalStrategy(Admin.authenticate()));
// ----------------------------------------------------------------------------------------------------------------------------
router.get("/", function (req, res, next) {
  res.render("admin/adminlogin");
});
// ----------------------------------------------------------------------------------------------------------------------------
router.post(
  "/login",
  passport.authenticate("admin", {
    failureRedirect: "/admin",
    successRedirect: "/admin/users",
  }),
  function (req, res) { }
);
//-----------------------------------------------------register----------------------------------------------------------------
router.get("/register", function (req, res, next) {
  try {
    res.render("admin/adminregister");
  } catch (error) {
    console.log("This error is from /regieter route and the  " + error);
  }
});
//-----------------------------------------------------------------------------------------------------------------------------
router.post("/register", async function (req, res) {
  try {
    const { username, name, password, role, email } = req.body;
    const admin = await Admin.register(
      { username, name, role, email },
      password
    );
    await res.redirect("/admin");
  } catch (error) {
    res.send(error.message);
  }
});
//-----------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------islogged_in--------------------------------------------------------------
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/admin");
  }
}
// ----------------------------------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------------------------------
router.get("/users", isLoggedIn, async (req, res) => {
  try {
    const a = await User.find({}).exec();
    var allUsers = [...a];
    res.render("admin/homepage", { allUsers: allUsers, admin: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
// ----------------------------------------------------------------------------------------------------------------------------
router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/admin");
  });
});
// ----------------------------------------------------------------------------------------------------------------------------
router.get("/users/:id", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("updates");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("admin/userupdates", { user });
  } catch (error) {
    res.status(500).send("Error fetching user details: " + error);
  }
});
// ---------------------------------------------------------------------------------------------------------------------------
router.get("/users/:id/add-task", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("admin/addtask", { user });
  } catch (error) {
    res.status(500).send("Error fetching user details: " + error);
  }
});
// ----------------------------------------------------------------------------------------------------------------------------
router.post("/users/:id/add-task", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, desc } = req.body;
    if (!title || !desc) {
      return res.status(400).send("Title and description are required");
    }
    const task = new Task({
      title,
      desc,
      user: userId,
    });
    await task.save();
    await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: task._id } },
      { new: true }
    );
    res.redirect("/admin/users/");
  }
  catch (error) {
    res.status(500).send("Error adding task: " + error);
  }
});
// ----------------------------------------------------------------------------------------------------------------------------
router.get("/users/:id/time-details", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("time");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("admin/timedets", { user });
  } catch (error) {
    res.status(500).send("Error fetching user time details: " + error);
  }
});
// ----------------------------------------------------------------------------------------------------------------------------
router.get('/users/:id/delete', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.render("admin/delete", { user: user });
  } catch (error) {
    console.log("thiss is " + error);
  }
});
// ----------------------------------------------------------------------------------------------------------------------------
router.get('/users/:id/delete/delete-updates', async (req, res) => {
  const userId = req.params.id;
  const check = await User.findById(userId);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { updates: [] } },
      { new: true }
    );
    await Updates.deleteMany({ user: userId });
    if (check.updates.length == 0) {
      res.render("admin/processing", { user: userId, status: 'All records are already deleted from database' })
    } else {
      res.render("admin/processing", { user: userId, status: 'All the record deleted from database' })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//----------------------------------------------------------------------------------------------------------------------------------
router.get('/users/:id/delete/delete-time', async (req, res) => {
  const userId = req.params.id;
  const check = await User.findById(userId);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { time: [] } },
      { new: true }
    );
    await Time.deleteMany({ user: userId });
    if (check.time.length == 0) {
      res.render("admin/processing", { user: userId, status: 'All recorded time is already deleted from database' })
    } else {
      res.render("admin/processing", { user: userId, status: 'All the time record is deleted from database' })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//--------------------------------------------------------------------------------------------------------------------------------
router.get('/users/:id/delete/delete-task', async (req, res) => {
  const userId = req.params.id;
  try {
    const check = await User.findById(userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { tasks: [] } },
      { new: true }
    );
    await Task.deleteMany({ user: userId });
    if (check.tasks.length == 0) {
      res.render("admin/processing", { user: userId, status: 'There is no task allocated to this user or data is already deleted' })
    } else {
      res.render("admin/processing", { user: userId, status: 'All task is deleted from database' })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//--------------------------------------------------------------------------------------------------------------------------------


router.get("/users/:id/get-report", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const currentDate = new Date().toISOString().split('T')[0];
    const updates = await Updates.find({
      user: userId,
      createdAt: { $gte: currentDate, $lt: `${currentDate}T23:59:59.999Z` },
    });
    const timeDetails = await Time.find({
      user: userId,
      createdAt: { $gte: currentDate, $lt: `${currentDate}T23:59:59.999Z` },
    });
    const tasks = await Task.find({
      user: userId,
      createdAt: { $gte: currentDate, $lt: `${currentDate}T23:59:59.999Z` },
    });
    res.render("admin/report", { updates, timeDetails, tasks, userId, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating report: " + error);
  }
});
//--------------------------------------------------------------------------------------------------------------------------------

router.get("/users/:id/getpdf", isLoggedIn, async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
  }
});
//--------------------------------------------------------------------------------------------------------------------------------


module.exports = router;
