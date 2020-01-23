const express = require("express");
const router = express.Router();

/*
@route   GET /api/users/test
@desc    Tests user routes
@access  Public
*/
router.get("/test", (req, res) => res.json({ msg: "Users Working" }));

module.exports = router;
