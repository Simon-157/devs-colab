require("dotenv").config();
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require("passport")
const cors = require('cors')
const Store = require("connect-mongo")
const authRoute = require("./routes/authRoute")
const userRoute = require("./routes/userRoute")
const challengesRoute = require("./routes/challengesRoute")
require("dotenv").config();
require ("./config/db")


app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      store: Store.create({ mongoUrl: process.env.MONGODB_URL }),
      cookie: { maxAge: 180 * 60 * 1000 },
    })
  );

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)


app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/challenges", challengesRoute);

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
  });

