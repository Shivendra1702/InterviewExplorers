const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const register = async (req, res) => {
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
    if (image) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    return res.status(400).json({
      ok: false,
      message: `Error Registering User: ${error}`,
    });
  }
};

const login = async (req, res) => {
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
};

const profile = async (req, res) => {
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
};

const logout = async (req, res) => {
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
};

module.exports = {
  register,
  login,
  profile,
  logout,
};
