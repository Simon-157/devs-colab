const agent = require("../config/postgredb");


agent.connect()
const getChallenges = (req, res) =>{
    // console.log("route hit")
    agent.query('Select * from problems', (err, result)=>{
        if(!err) {res.send(result.rows); console.log(result.rows)}
            // console.log(result.rows);
       
        else {console.log(err.message)}
        
    });
    agent.end;
}

const addChallenge = (req, res) =>{
    const challenge = req.body
    agent.query('INSERT INTO problems (title, description) VALUES ($1, $2) RETURNING *', [challenge?.topic, challenge?.description], (error, results) =>{
            if(!error){console.log(results.rows)}
            else{console.log(error.message)}
        }
    );
    agent.end;
}


module.exports = {
    getChallenges,
    addChallenge,
}