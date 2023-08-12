const express = require('express');
const { getAllProducts, createproduct, updateProduct, deleteProduct, getProductDetails} = require('../controllers/productcontroller');
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const { createProductReview, getAllreviews, deleteReview } = require('../controllers/userController');
const router = express.Router();


router.route("/products").get(getAllProducts)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createproduct)
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct).get(getProductDetails)
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(getAllreviews).delete(isAuthenticatedUser,deleteReview)
router.route("/product/:id").get(getProductDetails);

module.exports = router