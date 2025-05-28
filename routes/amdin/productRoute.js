const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productController");

//can import router as as whole and use it's fucntions

// const {createProduct} = require("../../controllers/admin/productController");

router.post("/", productController.createProduct);

router.get("/", productController.getProducts);
module.exports = router;
