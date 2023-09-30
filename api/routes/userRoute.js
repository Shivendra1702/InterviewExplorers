const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
  logout,
} = require("../controllers/UserController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").post(profile);
router.route("/logout").post(logout);

module.exports = router;
