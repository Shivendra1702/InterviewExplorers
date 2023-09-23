require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const User = require("./models/User");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

// Routes
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.find({ email });
    if (user.length !== 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      username,
      email,
      password,
    });
    return res
      .status(201)
      .json({ ok: true, message: "User created successfully", newUser });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Registering User: ${error}`,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(400)
        .json({ ok: false, message: "Email and Password Required" });
    }
    const user = await User.find({ email });
    if (user.length === 0) {
      return res.status(400).json({ ok: false, message: "User not found" });
    }
    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, message: "Invalid Password" });
    }
    return res.status(200).json({ ok: true, message: "User Logged In" });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Logging in User: ${error}`,
    });
  }
});

module.exports = app;
