const {Router} = require('express')
const router = Router();
const { getChallenges, addChallenge } = require('../controllers/problemController');

router.get ('/get-challenges', getChallenges)

router.post ('/add-challenge/:title', addChallenge)

module.exports = router;