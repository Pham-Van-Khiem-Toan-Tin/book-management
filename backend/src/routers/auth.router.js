const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { isAuthenticated, isAuthorization } = require("../middlewares/auth.middleware");
const { renewToken, baseProfile } = require("../controllers/auth.controller");
require("dotenv").config();

router.get("/login/success", (req, res) => {
  
  if (req.user) {
    const user = req.user;
    const accessToken = jwt.sign(
      {
        sub: user._id,
        name: user.name,
        email: user?.email,
        roles: user.roles,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRED }
    );
    const refreshToken = jwt.sign(
      {
        sub: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRED }
    );
    res.clearCookie("connect.sid", {
      httpOnly: true,
    })
    res.cookie("rft", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 90*24*60*60*1000 
    })
    res.status(200).json({
      accessToken: accessToken,
      sub: user._id,
    });
  } else {
    res.status(500).json({
      error: true,
      message: "Not Authorized",
    });
  }
});
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login failed",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.GOOGLE_CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.GOOGLE_CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.GOOGLE_CLIENT_URL);
});
router.get("/facebook", passport.authenticate("facebook", ["public_profile"]));
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.route("/token").get(renewToken);
router.route("/base").get(isAuthenticated, isAuthorization("VIEW_PROFILE"), baseProfile);
module.exports = router;
