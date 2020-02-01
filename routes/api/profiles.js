const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Models
const Profile = require("../../models/Profile");

/*
@route   GET /api/profiles/test
@desc    Tests profile routes
@access  Public
*/
router.get("/test", (req, res) => res.json({ msg: "Profile Working" }));

/*
@route   GET /api/profiles
@desc    Get current user profile
@access  Private
*/
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
