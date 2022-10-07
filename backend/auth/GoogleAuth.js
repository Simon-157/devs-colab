const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
require("dotenv").config();
const client = require("../config/postgredb");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      const account = profile._json;
      let user = {};
      try {
        const currentUserQuery = await client.query(
          "SELECT * FROM users WHERE user_id=$1",
          [account.sub]
        );

        if (currentUserQuery.rows.length === 0) {
          // create user
          await client.query(
            "INSERT INTO users (username, img, google_id) VALUES ($1,$2,$3)",
            [account.name, account.picture, account.sub]
          );

          const id = await client.query("SELECT id FROM users WHERE user_id=$1", [
            account.sub,
          ]);
          user = {
            id: id.rows[0].id,
            username: account.name,
            img: account.picture,
          };
        } else {
          // have user
          user = {
            id: currentUserQuery.rows[0].id,
            username: currentUserQuery.rows[0].username,
            img: currentUserQuery.rows[0].img,
          };
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // loads into req.session.passport.user
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // loads into req.user
  done(null, user);
});