require('dotenv').config();
require ('../auth/GitHubAuth')
const { Router } = require('express');
const router = Router();

router.get("/github", passport.authenticate("github"));


router.get(
    "/github/callback",
    passport.authenticate("github", {
      successRedirect: process.env.CLIENT_URI,
      failureRedirect: "/failure",
    })
  );

module.exports = router;