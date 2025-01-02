const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const fileUpLoad = require("express-fileupload");
const session = require("express-session")

const passportSetup = require("./src/config/passport");
const passport = require("passport");
const authRoute = require("./src/routers/auth.router");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(fileUpLoad({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "tmp"),
  limits: { fileSize: 50 * 1024 * 1024 },
}));

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
const authoritiesRouter = require("./src/routers/authorities.router");
const categoryRouter = require("./src/routers/category.router");
const libraryRouter = require("./src/routers/library.router");
const bookcaseRouter = require("./src/routers/bookcase.router");
const bookshelfRouter = require("./src/routers/bookshelf.router");
const userRouter = require("./src/routers/user.router");
const bookRouter = require("./src/routers/book.router");
const borrowRouter = require("./src/routers/borrow.router");
const profileRouter = require("./src/routers/profile.router");


app.use("/auth", authRoute);
app.use("/profile", profileRouter);
app.use("/admin", authoritiesRouter);
app.use("/admin/categories", categoryRouter);
app.use("/admin/libraries", libraryRouter);
app.use("/admin/bookcases", bookcaseRouter);
app.use("/admin/bookshelves", bookshelfRouter);
app.use("/admin/users", userRouter);
app.use("/admin/books", bookRouter);
app.use("/admin/borrows", borrowRouter);

module.exports = app;