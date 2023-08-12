const User = require("../models/usermodel");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require('jsonwebtoken')

exports.isAuthenticatedUser = async (req,res,next) => {
    try{
    const {token} = req.cookies;
        
    if(!token)
    {
        return next(new ErrorHandler("Please Login or register",401))
    }
    
    const decodedData = jwt.verify(token,process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)
    next();

    }catch(e){
        console.log(e)
    }
}

exports.authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandler(`Role:${req.user.role} is not allowed this resourse`,404))
        }
        next();
    }
}