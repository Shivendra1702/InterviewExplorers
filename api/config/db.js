const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to Database`);
  } catch (error) {
    console.error(`Error Connecting to Database: ${error.message}`);
    process.exit(1); // Exit the application if the database connection fails
  }
};

module.exports = { connectDB };
