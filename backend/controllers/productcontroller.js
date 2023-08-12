const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchasyncerror')
const Apifeatures = require('../utils/apifeatures')

//create product --Admin route

exports.createproduct = async (req,res,next) => {

  req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
}


//get ALl Products
exports.getAllProducts = async (req,res,next) => {
  const resultsPerPage = 8;
  const productsCount = await Product.countDocuments()

    const apifeature = new Apifeatures(Product.find(),req.query).search().filter().pagination(resultsPerPage)
    const products = await apifeature.query
    let filteredProductsCount = products.length

    
    res.status(200).json({success:true,
    products,
    productsCount,
    resultsPerPage,
    filteredProductsCount
  })
}

//Update Product --Admin route

exports.updateProduct = async (req,res,next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Invalid Product Id"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})

    res.status(200).json({
        success:true,
        product
    })
}

//Delete Product

exports.deleteProduct = async (req, res, next) => {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(500).json({
          success: false,
          message: "Product Not Found",
        });
      }
  
      await Product.deleteOne({ _id: req.params.id });
  
      res.status(200).json({
        success: true,
        message: "Successfully deleted",
      });
  };
  
  //Get Product Details

  exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id).exec();
    console.log(product)
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      product,
    });
  };