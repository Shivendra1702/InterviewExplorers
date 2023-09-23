const app = require("./app");
const { connectDB } = require("./config/db");

// Connect Database
connectDB();

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server Running on Port ${process.env.PORT || 4000}`);
});
