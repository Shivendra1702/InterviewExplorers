const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

userSchema.methods.isValidPassword = async (userSendPassword) => {
  return await bcrypt.compare(userSendPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
