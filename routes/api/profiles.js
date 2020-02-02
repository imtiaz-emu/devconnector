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

/*
@route   POST /api/profiles
@desc    Create or Update Profile 
@access  Private
*/
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.slug) profileFields.slug = req.body.slug;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.github) profileFields.github = req.body.github;
    // Skills - spilt as array
    if (req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(",");
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    Profile.findOne({ user: profileFields.user }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: profileFields.user },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // create
        Profile.findOne({ slug: profileFields.slug }).then(profile => {
          if (profile) {
            errors.slug = "This slug/username is already taken";
            return res.status(400).json(errors);
          } else {
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          }
        });
      }
    });
  }
);

module.exports = router;
