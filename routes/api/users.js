const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const User = require("../../models/User");

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
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.json({ email: "user already exists" });
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

module.exports = router;
