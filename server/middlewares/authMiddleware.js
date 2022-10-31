const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protect = async (req, res, next) =>{
    let token, decoded

    try{
        token = req.cookies.cookie;

        if(token == 'undefined' || token == null || token == ''){
            req.user = null
            res.status(401)
        }else{
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, id) =>{
                if(error){
                    req.user = null
                    res.status(403)
                }else{
                    decoded = id.id
                }
            })
            
            const user =  await User.findById(decoded).select("-password")

            req.user =  user
        }

        next();
    }catch(error){
        res.status(401)
    }
    
}

module.exports = { protect }