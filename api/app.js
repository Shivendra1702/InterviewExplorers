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
  let image;
  try {
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        message: `Please Select Profile Image`,
      });
    }
    console.log(req.files);
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      return res.status(400).json({
        ok: false,
        message: `Please add all the fields`,
      });
    }

    image = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
      folder: "InterviewExplorers",
    });

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      username,
      email,
      password,
      photo: {
        id: image.public_id,
        url: image.url,
      },
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
    req.user = user;
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
    const token =
      req.header("Authorization").replace("Bearer ", "") || req.body.token;
    const userJwt = jwt.verify(token, process.env.JWT_SECRET, {});
    const user = await User.findById(userJwt.id);
    if (!user) {
      return res.status(400).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, message: "Authorized", user });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error : ${error}`,
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
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

app.get("/post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate(
      "comments.userId",
      "username photo.url"
    );
    return res.status(200).json({
      ok: true,
      message: "Post Fetched",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Fetching Post: ${error}`,
    });
  }
});

app.get("/getmyposts/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      message: "User Posts Fetched",
      posts,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Fetching User Posts: ${error}`,
    });
  }
});

app.delete("/deletepost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    await cloudinary.uploader.destroy(post.cover.id);
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      ok: true,
      message: "Post Deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Deleting Post: ${error}`,
    });
  }
});

app.put("/editpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    console.log(post);

    if (req.body.title) post.title = req.body.title;

    if (req.body.summary) post.summary = req.body.summary;

    if (req.body.content) post.content = req.body.content;

    if (req.files) {
      await cloudinary.uploader.destroy(post.cover.id);
      const image = await cloudinary.uploader.upload(
        req.files.file.tempFilePath,
        {
          folder: "InterviewExplorers",
        }
      );
      post.cover.url = image.url;
      post.cover.id = image.public_id;
    }

    post.save({
      validateBeforeSave: false,
    });

    return res.status(200).json({
      ok: true,
      message: "Post Edited",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Editing Post: ${error}`,
    });
  }
});

app.post("/addcomment", async (req, res) => {
  try {
    const { postId, userId, comment } = req.body;
    if (!(postId && userId && comment)) {
      return res.status(400).json({
        ok: false,
        message: `PostId, UserId and Comment Required`,
      });
    }
    const post = await Post.findById(postId);
    post.comments.push({
      postId,
      userId,
      comment,
    });
    post.save({
      validateBeforeSave: false,
    });
    return res.status(200).json({
      ok: true,
      message: "Comment Added",
      post,
    });
  } catch (error) {
    return res.json({
      ok: false,
      message: `Error Adding Comment: ${error}`,
    });
  }
});

module.exports = app;
