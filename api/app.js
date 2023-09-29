require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

// Models
const User = require("./models/User");
const Post = require("./models/Post");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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
      .json({ ok: true, message: "User Logged In", user, token });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Logging in User: ${error}`,
    });
  }
});

app.post("/profile", async (req, res) => {
  try {
    const { token } = req.body;

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
    console.log(`sexy: ${req.body.token}`);
    return res.status(200).json({
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

app.post("/post", async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        message: `No file uploaded`,
      });
    }

    const { title, summary, content, token } = req.body;
    if (!(title && summary && content)) {
      return res.status(400).json({
        ok: false,
        message: `Title, Summary and Content Required`,
      });
    }

    const image = await cloudinary.uploader.upload(
      req.files.file.tempFilePath,
      {
        folder: "InterviewExplorers",
      }
    );

    const user = jwt.verify(token, process.env.JWT_SECRET, {});
    const person = await User.findById(user.id);
    console.log(person.username);

    const post = await Post.create({
      author: person.username,
      title,
      summary,
      content,
      cover: {
        id: image.public_id,
        url: image.url,
      },
      user: user.id,
    });

    return res.status(200).json({
      ok: true,
      message: "Post Created",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Creating Post: ${error}`,
    });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      ok: true,
      message: "Posts Fetched",
      posts,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Fetching Posts: ${error}`,
    });
  }
});

module.exports = app;
