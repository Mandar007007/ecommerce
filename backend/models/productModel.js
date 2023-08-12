const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"]
    },
    description:{
        type:String,
        required:[true,"Please enter description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product price"],
        maxLength:[8,"cant exeed 8 numbers"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
       public_id:{
            type:String,
            required:true
       },
       url:{
        type:String,
        required:true
       }
    }
    ],
    category:{
        type:String,
        required:[true,"Enter categoty"]
    },
    stock:{
        type:Number,
        required:[true,"Enter stock"],
        maxLength:[4,"Can't exeed 4 numbers"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",ProductSchema)