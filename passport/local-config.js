var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const User = require('mongoose').model('User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("searching down a user with username " + username)
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));