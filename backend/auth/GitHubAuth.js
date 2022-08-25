const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy
const User = require ('../models/Users')

passport.use(
    new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
    }, 
    (accessToken, refreshToken, profile, done) => {
        console.log(profile );
        User.findOne({User_id: profile.id})
        .then(currentUser => {
            if (currentUser) {
              done(null, currentUser);
            } else {
              new User({
                User_id: profile.id,
                userName: profile.displayName,
                profileImg: profile.photos[0].value,
              })
                .save()
                .then(newUser => {
                  done(null, newUser);
                });
            }
          });
    }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
  });

passport.deserializeUser(async (userId, done) => {
    const user = await User.findOne({ _id: userId })
    done(null, user);
  });