const {Router} = require('express')
const router = Router();

client.connect();
router.get ('/challenges', (req, res)=>{
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















