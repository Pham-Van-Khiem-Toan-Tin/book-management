const cloudinary = require("cloudinary");
const connect = require("./config/db.config")
const app = require("./server");
require("dotenv").config();

const PORT = process.env.PORT || 8888;

connect();

app.listen(PORT, () => {
  console.log("This app connected to sever by using localhost: " + PORT);
});