const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto =  require('crypto')

const  userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"],
        maxLength:[30,"Can't Exeed 30"],
        minLength:[4,"name Should of minimum 4 letters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter A valid Email"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password should be greater than 8 characters"],
        select:false
    },
    avtar:{
              public_id:{
                 type:String,
                 required:true,
            },
            url:{
             type:String,
             required:true
            }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpire:Date

})

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next() 
    }

    this.password = await bcrypt.hash(this.password,10)

})

//JWT TOKEN

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

//Compare Password

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password)
}

//create password reset token

userSchema.methods.getpasswordResetToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex")

    //Hashing and add to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model("User",userSchema);