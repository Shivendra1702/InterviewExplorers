require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const User = require("./models/User");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
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

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ ok: false, message: "User not found" });

    const validPassword = await user.isValidPassword(password);
    if (!validPassword)
      return res.status(400).json({ ok: false, message: "Invalid Password" });

    const token = user.getJwtToken();
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Adjust the expiration time as needed
      })
      .json({ ok: true, message: "User Logged In", user });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Logging in User: ${error}`,
    });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        throw err;
      } else {
        const user = await User.findById(info.id);
        return res
          .status(200)
          .json({ ok: true, message: "Authorized", info, user });
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error : ${error}`,
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
    return res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        sameSite: "None",
        secure: true,
        httpOnly: true,
      })
      .status(200)
      .json({
        ok: true,
        message: "User Logged Out",
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Logging out User: ${error}`,
    });
  }
});

module.exports = app;
