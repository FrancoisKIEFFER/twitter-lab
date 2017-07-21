const express        = require("express");
const authController = express.Router();

// User model
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }


  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPass
  });

  newUser.save()
  .then(() => {
    res.redirect("/login")
  }).catch((err) => {
    res.render("auth/signup", {
      errorMessage: "Something went wrong when signing up"
    });
  })
});

authController.get('/login',(req, res, next) => {
  res.render("auth/login");
});

authController.post("/login", (req, res, next) => {

  const {username,password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }


  User.findOne({ username },
    "_id username password following")
    .then((user) => {
      if (user){  
        if ( bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect("/")
          } else {
            res.render("auth/login", {
              errorMessage: "Incorrect password"
            });
          }
        } else {
          res.render('auth/login',{
              errorMessage: "The username doesn't exist"
          })
        }
    }).catch((err) => {
      res.render('auth/login',{
        errorMessage: err
      })
    });
});

authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = authController;