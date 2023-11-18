var express = require("express");
var router = express.Router();
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
// -----------Passport----------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use("admin", new LocalStrategy(Admin.authenticate()));
// ----------------------------------------------

/* GET admin listing. */
router.get("/", function (req, res, next) {
  res.render("admin/adminlogin");
});

router.post(
  "/login",
  passport.authenticate("admin", {
    failureRedirect: "/admin",
    successRedirect: "/admin/users",
  }),
  function (req, res) {}
);

// --------------------------register------------------------
router.get("/register", function (req, res, next) {
  try {
    res.render("admin/adminregister");
  } catch (error) {
    console.log("thiss is " + error);
  }
});

router.post("/register", async function (req, res) {
  try {
    const { username, name, password, role, email } = req.body;
    const admin = await Admin.register(
      { username, name, role, email },
      password
    );
    await res.render("admin/adminlogin");
  } catch (error) {
    res.send(error.message);
  }
});
// ---------------------------------------------------------------
// --------------------------islogged_in------------------------------
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/admin");
  }
}
// -----------------------------------------------------------------------


// -----------------------------------------------------------------
router.get("/users", isLoggedIn, async (req, res) => {
  try {
    const a = await User.find({}).exec();
    var allUsers = [...a];
    console.log(req.user);
    console.log("nfrjnr");


    res.render("admin/homepage", { allUsers: allUsers,admin:req.user});
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
// --------------------------------------------------------------------
router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// -----------------------------------------------------------------
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
// --------------------------------------------------------------------
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


router.post("/users/:id/add-task", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, desc } = req.body;

    // Validate task data
    if (!title || !desc) {
      return res.status(400).send("Title and description are required");
    }

    // Create a new task
    const task = new Task({
      title,
      desc,
      user: userId,
    });

    // Save the task to the database
    await task.save();

    res.redirect("/admin/users/");
  } catch (error) {
    res.status(500).send("Error adding task: " + error);
  }
});
module.exports = router;
