const cloudinary = require("cloudinary");
const connect = require("./src/config/db.config")
const app = require("./server");
const errorHandler = require("./src/middlewares/error.middleware");

require("dotenv").config();

const PORT = process.env.PORT || 8888;

connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
app.use(errorHandler)

app.listen(PORT, () => {
  console.log("This app connected to sever by using localhost: " + PORT);
});