const express = require("express");
const mongoose = require("mongoose");
const usersRoute = require("./routes/api/users");
const profilesRoute = require("./routes/api/profiles");
const postsRoute = require("./routes/api/posts");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect DB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Get Routes
app.use("/api/users", usersRoute);
app.use("/api/profiles", profilesRoute);
app.use("/api/posts", postsRoute);

PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`App is running on port ${PORT}`);
});
