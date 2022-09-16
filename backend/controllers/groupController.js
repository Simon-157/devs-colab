const client = require("../config/postgredb")

client.connect()

const createDocument = (req, res) =>{
    const date = new Date()
    const id = req.params
    client.query(`INSERT INTO documents (body, problem_key, date_created) 
            VALUES ($1, $2, $3) RETURNING *`, ["//Start your code here",id, date.now() ], (error, results) =>{
            if(!error){console.log(results.rows)}
            else{console.log(error.message)}
        }
    );
    client.end()

    
}

const createGroup = (req, res) =>{
    const date = new Date()
    const details = req.body
    client.query(`INSERT INTO documents (users, group_name, date) 
            VALUES ($1, $2, $3, $4) RETURNING *`, [[details.id], details.group_name, date.now() ], 
            (error, results) =>{
            if(!error){console.log(results.rows)}
            else{console.log(error.message)}
        }
    );
    client.end()

}

const getUserGroups = (req, res) => {
    const u_groupsIds = null;
    const groupsById = {};
    const groups = null;
    let allUsersId = [];
    const usersById = {}
    client.query (`select groups[:] from users where user_id = ${req.params.userId}`, (err, results) =>{
        if(!err){
            u_groupsIds = results.rows
        }

    })

    client.query(`select * from groups where group_id in ${u_groupsIds}`, (err, results) =>{
        if(!err){
            groups = results.rows
        }
    })
    
    groups.map(group => {
        groupsById[group.id] = group;
        allUsersId = allUsersId.concat(group.users);
    })

    client.query(`select * from users where user_id in ${allUsersId}`, (err, usersResults) =>{
        if(!err){
            usersResults.rows.forEach(user => {
                usersById[user.id] = user;
            })
        }
        console.log("an error occured in getting user groups", err.message)

    })
    client.end()
    res.json({groupsById, usersById, allUsersId, groups})
    
}


module.exports = {
    createDocument,
    createGroup,
    getUserGroups
}