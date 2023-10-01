const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
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
};

const getAllPosts = async (req, res) => {
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
};

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
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
};

const getMyPosts = async (req, res) => {
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
};

const deletePost = async (req, res) => {
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
};

const editPost = async (req, res) => {
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
};

const addComment = async (req, res) => {
  try {
    const { postId, userId, comment } = req.body;
    if (!(postId && userId && comment)) {
      return res.status(400).json({
        ok: false,
        message: `PostId, UserId and Comment Required`,
      });
    }
    const user = await User.findById(userId);
    const newComment = await Comment.create({
      postId,
      userId,
      username: user.username,
      photo: user.photo.url,
      comment,
    });

    return res.status(200).json({
      ok: true,
      message: "Comment Added",
      newComment,
    });
  } catch (error) {
    return res.json({
      ok: false,
      message: `Error Adding Comment: ${error}`,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      message: "Comments Fetched",
      comments,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Fetching Comments: ${error}`,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      ok: true,
      message: "Comment Deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error Deleting Comment: ${error}`,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPosts,
  deletePost,
  editPost,
  addComment,
  getComments,
  deleteComment,
};
