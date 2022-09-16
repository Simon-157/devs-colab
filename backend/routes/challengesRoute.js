const {Router} = require('express')
const router = Router();
const client = require("../config/postgredb")


client.connect();
router.get ('/get-challenges', (req, res)=>{
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

router.post ('/add-challenge/:title', (req, res) =>{
    const challenge = req.body
    client.query('INSERT INTO problems (title, description) VALUES ($1, $2) RETURNING *', [challenge?.topic, challenge?.description], (error, results) =>{
            if(!error){console.log(results.rows)}
            else{console.log(error.message)}
        }
    );
    client.end;
})

module.exports = router;