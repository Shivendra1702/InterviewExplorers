const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: [6, "Password Must be 6 characters Long !"],
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isValidPassword = async function (userSendPassword) {
  return await bcrypt.compare(userSendPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
