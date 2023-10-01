const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, "Please keep Title Short!!"],
    },
    summary: {
      type: String,
      // required: true,
      maxlength: [400, "Please keep Summary Short!!"],
    },
    content: {
      type: String,
      required: true,
    },
    cover: {
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
