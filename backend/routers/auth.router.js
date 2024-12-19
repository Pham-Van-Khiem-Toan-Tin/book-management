const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();

router.get("/login/success", (req, res) => {
    console.log(req.user);
    
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully LogIn",
      user: req.user,
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
router.get("/google", passport.authenticate("google", 
    {scope: ["profile", "email"]})
);

module.exports = router;
