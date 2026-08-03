const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});

const start = async () => {
  const app = require("./app");
  const connectDB = require("./config/db");

  const PORT = process.env.PORT || 5000;

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

start();
