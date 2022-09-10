require("dotenv").config();
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require("passport")
const cors = require('cors')
const Store = require("connect-mongo")
const authRoute = require("./routes/authRoute")
const client = require("./config/postgredb")
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


app.use("/auth", authRoute);

client.connect();
app.get('/challenges', (req, res)=>{
  client.query(`Select * from problems`, (err, result)=>{
      if(!err){
          res.send(result.rows);
          console.log(result.rows);
      }else{
        console.log(err.message)
      }
  });
  client.end;
})

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
  });

