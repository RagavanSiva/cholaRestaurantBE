const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, isActive } = req.body;
    // Check if the product name already exists
    const existingProduct = await Product.findOne({
      name: {
        $regex: name,
        $options: "i",
      },
    });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists" });
    }
    const product = new Product({ name, price, category, isActive });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, isActive } = req.body;
    // Check if the updated name already exists in another product
    const existingProduct = await Product.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, isActive },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    if (!page || !limit) {
      const products = await Product.find(query).populate("category");
      const count = products.length; // Get the count of all products
      res.json({
        data: products,
        totalRecords: count,
        currentPage: 1, // Since all records are on one page
      });
    } else {
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;

      const products = await Product.find(query)
        .populate("category")
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .exec();

      const count = await Product.countDocuments(query);
      res.json({
        data: products,
        totalRecords: count,
        currentPage: pageNumber,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update the isActive status of a product by ID
exports.updateProductIsActive = async (req, res) => {
  try {
    const { isActive } = req.body;

    // Check if the product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the isActive status
    product.isActive = isActive;
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
