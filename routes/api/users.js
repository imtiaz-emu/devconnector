const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User");
const keys = require("../../config/keys");
const validateUserRegisterInputs = require("../../validations/register");
const validateUserLoginInputs = require("../../validations/login");

/*
@route   GET /api/users/test
@desc    Tests user routes
@access  Public
*/
router.get("/test", (req, res) => res.json({ msg: "Users Working" }));

/*
@route   POST /api/users/register
@desc    Register User
@access  Public
*/
router.post("/register", (req, res) => {
  const { errors, isValid } = validateUserRegisterInputs(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "user already exists";
      res.json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: 200,
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/*
@route   POST /api/users/login
@desc    Login User / Return JWT - Token
@access  Public
*/
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateUserLoginInputs(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payLoad = { id: user.id, name: user.name, avatar: user.avatar };

        jwt.sign(
          payLoad,
          keys.secretOrKey,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) throw err;
            res.json({
              token: "Bearer " + token,
              success: true
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

/*
@route   GET /api/users/current
@desc    Get the current user using JWT token 
@access  Private
*/
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
