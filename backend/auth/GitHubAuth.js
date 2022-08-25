const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy
const User = require ('../models/Users')

passport.use(
    new GithubStrategy({
        clientSecret:"",
        clientID: "",
        callbackURL: "",
    }, 
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        User.findOne({User_id: profile.id})
        .then(currentUser => {
            if (currentUser) {
              done(null, currentUser);
            } else {
              new User({
                User_id: profile.id,
                userName: profile.username,
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