const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const jwt = require("jsonwebtoken");
const passport = require("passport");
const userModel = require("../models/user.model");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      try {
        let user = await userModel.findOne({
          oauth_id: profile?.id,
          type: "google",
        });
        if (!user) {
          user = await userModel.create({
            oauth_id: profile?.id,
            type: "google",
            name: profile?.displayName,
            email: profile?.emails[0].value,
            avatar: profile?.photos[0].value,
            role: "READER",
          });
        }
        const accessToken = jwt.sign(
          {
            sub: user._id.toString(),
            name: user.name,
            email: user?.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        done(null, { user, token: accessToken });
      } catch (error) {
        done(error, null);
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      scope: ["public_profile"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);

      done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
module.exports = passport;
