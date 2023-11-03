  var createError = require("http-errors");
  var express = require("express");
  var path = require("path");
  var cookieParser = require("cookie-parser");
  var logger = require("morgan");
  var indexRouter = require("./routes/index");
  var usersRouter = require("./routes/users");
  var adminRouter = require("./routes/admin");
  require("dotenv").config({ path: "./.env" });

  var app = express();

  // this is database connection
  // --------------------------------
  require("./models/connection");
  // --------------------------------

  // ---------------passport-------------------------------
  const passport = require("passport");
  const User = require("./models/userModel");
  const Admin = require("./models/adminModel");
  const session = require("express-session");
  const LocalStrategy = require("passport-local");
  //--------------------------------------------------------

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  // ---------------PASSPORT BOILERPLATE---------------------
  app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "This_is_secret",
    // cookie: { maxAge: 3 * 60 * 60 * 1000 },
  })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration for User
  passport.use("local", new LocalStrategy(User.authenticate()));
  passport.serializeUser((user, done) => {
  done(null, user);
  });
  passport.deserializeUser((user, done) => {
  done(null, user);
  });

  // Passport configuration for Admin
  passport.use("admin", new LocalStrategy(Admin.authenticate()));
  passport.serializeUser((admin, done) => {
  done(null, admin);
  });
  passport.deserializeUser((admin, done) => {
  done(null, admin);
  });

// -----------------------------------------

  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/admin", adminRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
  next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
  });

module.exports = app;
