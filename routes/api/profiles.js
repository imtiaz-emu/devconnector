const express = require("express");
const router = express.Router();

/*
@route   GET /api/profiles/test
@desc    Tests profile routes
@access  Public
*/
router.get("/test", (req, res) => res.json({ msg: "Profile Working" }));

module.exports = router;
