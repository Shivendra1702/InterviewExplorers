const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPosts,
  deletePost,
  editPost,
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/PostController");

router.route("/post").post(createPost);
router.route("/posts").get(getAllPosts);
router.route("/post/:id").get(getSinglePost);
router.route("/getmyposts/:id").get(getMyPosts);
router.route("/deletepost/:id").delete(deletePost);
router.route("/editpost/:id").put(editPost);
router.route("/addcomment").post(addComment);
router.route("/getcomments/:id").get(getComments);
router.route("/deletecomment/:id").delete(deleteComment);

module.exports = router;
