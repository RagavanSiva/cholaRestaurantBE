const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Create a new category
router.post("/", categoryController.createCategory);

// Get all categories
router.get("/", categoryController.getAllCategories);

router.get("/active", categoryController.getAllActiveCategories);

// Get a single category by ID
router.get("/:id", categoryController.getCategoryById);

// Update a category by ID
router.put("/:id", categoryController.updateCategory);

// Delete a category by ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
