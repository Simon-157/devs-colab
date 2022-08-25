const getUser = async (req, res) => {
    if(req.user){
        res.status(200).json({
            isAuth:req.user.isAuthenticated(),
            message:"user is authenticated",
            username:req.user,
        });
    } else {
        res.status(500).json({
            isAuth:false, 
            message:"user has not been authenticated"
        });
    }
}

const createUser = (req, res) => {
    
}