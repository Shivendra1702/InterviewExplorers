const app = require("./app");
const { connectDB } = require("./config/db");
const cloudinary = require("cloudinary").v2;

connectDB(); //connect with database

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server Running on Port ${process.env.PORT || 4000}`);
});
