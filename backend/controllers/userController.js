const ErrorHandler = require('../utils/errorhandler')
const User = require("../models/usermodel")
const Order = require("../models/orderModel")
const sendToken = require('../utils/jwttoken')
const sendEmail = require("../utils/sendEmail")
const crypto =  require('crypto')
const Product = require("../models/productModel")
const cloudinary = require("cloudinary")

//Register A User



exports.registerUser = async (req, res, next) => {
    try {
    //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avtar);
  
      const { name, email, password } = req.body;
      
      const user = await User.create({
        name,
        email,
        password,
        avtar: {
          public_id: "myCloud.public_id",
          url: "myCloud.secure_url"
        }
      });

  
      sendToken(user, 201, res);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };


exports.loginUser = async (req,res,next) => {

    const {email,password} = req.body

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",401))
    }

    const user = await User.findOne({email}).select("+password").exec();

    if(!user){
        return next(new ErrorHandler("Invalid Credentials",404))
    }

    const isMatched = await user.comparePassword(password)

    if(!isMatched)
    {
        return next(new ErrorHandler("Invalid credentials",401))
    }

    sendToken(user,200,res)
}

//Logout User

exports.logout = async(req,res,next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()), // Corrected code
        httpOnly: true
      });
      

    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
}

//Forgot password

exports.forgotPassword = async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})

    if(!user)
    {
        return next(new ErrorHandler("User Not Found",404))
    }

    //Get Reset Password Token

    const resetToken = user.getpasswordResetToken()
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `http://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your password reset token is : \n\n ${resetPasswordUrl}`
    
    try{

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message:message

        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    }catch(err){
        
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(err.message,500))
    }
}

//Reset password

exports.resetPassword = async (req,res,next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt: Date.now()}
    })
    if(!user){
        return next(new ErrorHandler("reset password Token is Invalid Or Has Been Expired",400))
    }

    if(req.body.password !== req.body.confirm)
    {
        return next(new ErrorHandler("Password Does Not Match",400))
    }

    user.password = req.body.password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined

    await user.save()

    sendToken(user,200,res)
}

//Get user Details

exports.getUserDetails = async(req,res,next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
}

//Update User Password

exports.updatePassword = async(req,res,next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isMatched = user.comparePassword(req.body.oldPassword)

    if(!isMatched)
    {
        return next(new ErrorHandler("Password does not matched",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password does't match",400))
    }

    user.password = req.body.newPassword
    await user.save()

    sendToken(user,200,res)
}


//Update Profile

exports.updateProfile = async(req,res,next) => {
   
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    //We will add cloudinary later

    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
        user
    })
}

//Get All Users {{Admin}}

exports.getAllUser = async (req,res,next) => {
    const users = await User.find({});

    res.status(200).json({
        success:true,
        users
    })
}

//Get User by Id {{Admin}}

exports.getSingleUser = async (req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User Does Not Exist with given Id"))
    }

    res.status(200).json({
        success:true,
        user
    })
}

//Update user Role

exports.updateUserRole = async(req,res,next) => {
   
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    //We will add cloudinary later

    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
        user
    })
}
//delete User

exports.deleteUser = async (req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user)
    {
        return next(new ErrorHandler("User not Found for given id",400));
    }

    await user.deleteOne({id:req.params.id})

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
}

//create new review or update the review

exports.createProductReview = async (req,res,next) => {

    const {rating,comment,productId} = req.body

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    let isReviewed = false
    let final = false
     isReviewed = product.reviews.forEach((rev) => {
        if(rev.user.toString() === req.user.id.toString()){
            final = true
        }
    })

    isReviewed = final

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user.id.toString()){
            rev.rating = rating,
            rev.comment = comment
            }
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;
    product.rating = product.reviews.forEach(rev => {
        avg += rev.rating
    })
    
    product.rating = avg/product.reviews.length
    
    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })

    
}

//get all reviews

exports.getAllreviews = async(req,res,next) => {
    const product = await Product.findById(req.query.id);

    if(!product)
    {
        return next(new ErrorHandler("No Product exist of given Id",404))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
}

//delete Review

exports.deleteReview = async(req,res,next) => {
    const product = await Product.findById(req.query.productId);
    if(!product)
    {
        return next(new ErrorHandler("No Product exist of given Id",404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0

    reviews.forEach(rev => {
        avg += rev.rating
    })

    const rating = avg / reviews.length
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        rating,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

}
