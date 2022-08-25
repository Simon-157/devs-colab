require("dotenv").config();
const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const Store = require("connect-mongo")
require ("./config/db")


app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      store: Store.create({ mongoUrl: "hh" }),
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


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
  });