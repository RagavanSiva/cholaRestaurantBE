const Customer = require("../models/Customer");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, address, isActive } = req.body;
    // Check if the phone number already exists
    const existingCustomer = await Customer.findOne({ phoneNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    const customer = new Customer({ name, phoneNumber, address, isActive });
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, address, isActive } = req.body;
    // Check if the updated phone number already exists in another customer
    const existingCustomer = await Customer.findOne({
      phoneNumber,
      _id: { $ne: req.params.id },
    });
    if (existingCustomer) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber, address, isActive },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all customers
// Get all customers with optional pagination and search by name or phone number
exports.getAllCustomers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { name: searchRegex }, // Search by name
          { phoneNumber: searchRegex }, // Search by phone number
        ],
      };
    }

    if (!page || !limit) {
      const customers = await Customer.find(query);
      const count = customers.length; // Get the count of all customers
      res.json({
        data: customers,
        totalRecords: count,
        currentPage: 1, // Since all records are on one page
      });
    } else {
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;

      const customers = await Customer.find(query)
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .exec();

      const count = await Customer.countDocuments(query);
      res.json({
        data: customers,
        totalRecords: count,
        currentPage: pageNumber,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
