const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create a new product
router.post("/", productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);

router.get(
  "/byCategoryId/:categoryId",
  productController.getProductsByCategoryId
);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID
router.put("/:id", productController.updateProduct);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

// Update the isActive status of a product by ID
router.put("/status/:id", productController.updateProductIsActive);

module.exports = router;
