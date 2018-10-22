var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('mongoose').model('User');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "640930211298-dchl0606tvv4mqul67dohpluucnacsdq.apps.googleusercontent.com",
    clientSecret: "-JnYAnjZPgQIUoKEK4kSVTpL",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("THIS IS THE GOOGLE PROFILE")
      console.log(profile)
       User.findOrCreate({ googleId: profile.id, displayName: profile.displayName }, function (err, user) {
         return done(err, user);
       });
  }
));