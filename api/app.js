require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//routers
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    // origin: "http://127.0.0.1:5173",
    origin: "https://interviewexplorers-xi2b.onrender.com",
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);

module.exports = app;
