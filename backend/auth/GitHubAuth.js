const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy
const User = require ('../models/Users')
const client = require('../config/postgredb')


// passport.use(
//   new GitHubStrategy({
//       clientID: process.env.CLIENT_ID,
//       clientSecret:process.env.CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//   }, 
//   (accessToken, refreshToken, profile, done) => {
//       console.log(profile );
//       // client.connect()
//     let currentUser = null;
//       client.query(`select * from users where user_id = ${profile.id}`, (err, user) => {
//         if(user?.rows.length() !== 0 ) {
//           currentUser = user?.rows
//             done(null, currentUser);
//         }
//         else if(err) {
//           console.log("an error occured while retrieving user, ", err.message)

//         }
        
//         else{
//           let newUser = null;
//           client.query(`insert into users(user_id, usename, profileimg, colab_groups) VALUES ($1, $2, $3, null) RETURNING *`, [profile?.id, profile?.displayName, profile?.photos[0].value], 
//           (error, results) =>{
//             if(!error){newUser = results.rows;console.log("user added, ", results.rows)}
//           })
//             done(null, newUser);
          

//         }
//       })
      
//       client.end()
        
//   }
//   )
// );







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

  // passport.deserializeUser(async (userId, done) => {
  //   const user = await client.query(`select * from users where user_id = ${userId}`)
  //   done(null, user);
  // });




