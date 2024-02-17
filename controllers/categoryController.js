const Category = require("../models/Category");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, active } = req.body;
    // Check if the category name already exists
    const existingCategory = await Category.findOne({
      name: {
        $regex: name,
        $options: "i",
      },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    const category = new Category({ name, description, active });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, active } = req.body;
    // Check if the updated name already exists in another category
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, active },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    if (!page || !limit) {
      const categories = await Category.find(query);
      const count = categories.length; // Get the count of all categories
      res.json({
        data: categories,
        totalRecords: count,
        currentPage: 1, // Since all records are on one page
      });
    } else {
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;

      const categories = await Category.find(query)
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .exec();

      const count = await Category.countDocuments(query);
      res.json({
        data: categories,
        totalRecords: count,
        currentPage: pageNumber,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
