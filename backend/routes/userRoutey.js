const { Router } = require('express');
const router = Router();

router.get("/current_user", (req, res) => {
    res.status(200).json({
      isAuth: req.isAuthenticated(),
      message: req.isAuthenticated()
        ? "Currently authenicated"
        : " Currently unauthenticated",
      user: req.user,
    });
  });