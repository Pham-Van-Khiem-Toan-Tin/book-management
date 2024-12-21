const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const fileUpLoad = require("express-fileupload");
const session = require("express-session")

const passportSetup = require("./config/passport");
const passport = require("passport");
const authRoute = require("./routers/auth.router");
require("dotenv").config();

const app = express();

// app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpLoad());

app.use(
  session({
    secret: 'khiem',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 5*60*100 }
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(function (request, response, next) {
//   if (request.session && !request.session.regenerate) {
//     request.session.regenerate = (cb) => {
//       cb();
//     };
//   }
//   if (request.session && !request.session.save) {
//     request.session.save = (cb) => {
//       cb();
//     };
//   }
//   next();
// });
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
const authoritiesRouter = require("./routers/authorities.router");
const categoryRouter = require("./routers/category.router");
const errorHandler = require("./middlewares/error.middleware");

// app.set("trust proxy", 1);
app.use("/auth", authRoute);
app.use("/admin", authoritiesRouter);
app.use("/admin/categories", categoryRouter);

app.use(errorHandler)

module.exports = app;