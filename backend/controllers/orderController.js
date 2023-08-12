const Order = require("../models/orderModel")
const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')


//Create New Order

exports.newOrder = async(req,res,next) => {
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxprice,shippingPrice,totalPrice} = req.body

    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo,itemsPrice,taxprice,shippingPrice,totalPrice,
        paidAt:Date.now(),
        user:req.user.id
    })

    res.status(201).json({
        success:true,
        order
    })
}

//get single Order
exports.getSingleOrder = async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate("user","name email")

    if(!order)
    {
        return next(new ErrorHandler("Order not found with this Id",404))
    }

    res.status(200).json({
        success:true,
        order
    })

}


//Get loggedin users orders

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).exec();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

//Get All orders --Admin

exports.getAllOrders = async(req,res,next) => {
  const order = await Order.find()

  let totalAmount = 0;

  order.forEach(order => {
    totalAmount += order.totalPrice;
  })

  res.status(200).json({
    success:true,
    totalAmount,
    order
  })
}

//Update order status --Admin

async function updateStock(id,quantity){
  const product = await Product.findById(id);

  product.stock-=quantity

  await product.save({validateBeforeSave:false})
}

exports.updateOrder = async(req,res,next) => {
  const order = await Order.findById(req.params.id)

  if(!order)
  {
    return next(new ErrorHandler("No order found",404))
  }
  if(order.orderStatus === "Delivered"){
    return next(new ErrorHandler("You have already delivered order",400))
  }

  order.orderItems.forEach(async o => {
     await updateStock(o.product,o.quantity)
  })

  order.orderStatus = req.body.status

  if(order.orderStatus === "Delivered")
  {
    order.deliveredAt = Date.now()
  }

  await order.save({validateBeforeSave:false})
  res.status(200).json({
    success:true,
  })
  
}

//delete orders --Admin

exports.deleteOrder = async(req,res,next) => {
  const order = await Order.findById(req.params.id)

  if(!order)
  {
    return next(new ErrorHandler("No order found",404))
  }

  Order.deleteOne(req.params.id)

  res.status(200).json({
    success:true,
  })
}

