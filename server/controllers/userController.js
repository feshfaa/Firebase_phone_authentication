const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const admin =  require('../config/firebase_config')
const { getAuth } = require('firebase-admin/auth')

const verifyPhone = async (req, res) =>{
    try{
        token = req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).json('Please try Again!')
        }

        await getAuth().verifyIdToken(token).then((decodeded =>{
            phone = decodeded.phone_number
        })).then(()=>{
            verified = true
        }).catch((error) => {
            if(error.code == 'auth/id-token-expired'){
                res.status(401)
            }
        
        })

        if(verified){ 
            res.status(200)
        }else{
            res.status(401)
        }
    }catch(err){
        res.status(400).json({'error':err})
    }
}

const findUserWithUsername = async (req, res)=>{

    const { username } = req.body

    try{
        const user = await User.findOne({
            'username': username
        })
        
        if( user ){
            res.status(200).json({'phone': user.number})

        }else{
            res.status(400).json({'erros':'unable to connect', 'user':false})
        }
    }catch(error){
        res.status(400).json({'error':error})
    }
}

const loginUser = async (req, res)=>{

    const {username, password} = req.body

    try{
        const user = await User.findOne({
            'username': username
        })
        
        if(user && (await bcrypt.compare(password, user.password)) ){

            const accessToken = await jwt.sign(
                {id:user._id.toJSON()}, 
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {expiresIn: 1000*60*15}
            )
            
            res.cookie('cookie', accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 15,
            });
            res.status(200).json({'user': true})

        }else{
            res.status(400).json({'erros':'unable to connect', 'user':false})
        }
    }catch(error){
        res.status(400).json({'error':error})
    }
}

const updatePassword = async (req, res)=>{

    const {password, username} = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password.toString(), salt)

    try{
        const user = await User.findOneAndUpdate({
            'username': username
        },{
            'password':hashedPassword
        })

        if(user){
            res.status(200).json({'success':user})
        }else{
            res.status(500)
        }
        
        

    }catch(error){
        res.status(400).json({'error':error})
    }
}

const registerUser = async (req, res)=>{

    const { username, email, password, fullname, number} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password.toString(), salt)

    let phone, verified=false

    try{
        token = req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).json('Please try Again!')
        }

        await getAuth().verifyIdToken(token).then((decodeded =>{
            phone = decodeded.phone_number
        })).then(()=>{
            verified = true
            console.log(verified)
        }).catch((error) => {
            if(error.code == 'auth/id-token-expired'){
                res.status(401)
            }
        
        })

        if(verified){
            const userExists = await User.findOne({ email: email })

            if( userExists ){
                return res.status(400).json({error: "User already exists"})
            }  

            const user = await User.create({
                'username': username,
                'email': email,
                'password': hashedPassword,
                'fullname': fullname,
                'number': number
            })

            if(user){
                const accessToken = await jwt.sign(
                    {id:user._id.toJSON()}, 
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    {expiresIn: 1000*60*15}
                )

                res.cookie('cookie', accessToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 15,
                }).status(201).json({'user': true});
            } 

        }
    }catch(err){
        res.status(400).json({'error':err})
    }

}

const getMe = async (req, res) =>{

    if(req.user){
        const me = req.user

        res.status(200).json(me)
    }else{
        res.status(401).json({error:'Please log in'})
    }
    
}

const logoutUser = async (req, res) =>{

    res.clearCookie('cookie')
    res.cookie('cookie', '', {
        maxAge: 0,
      });
    res.end();
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    findUserWithUsername,
    verifyPhone,
    updatePassword
}