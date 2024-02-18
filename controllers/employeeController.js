const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      employeeType,
      username,
      password,
      address,
      isActive,
    } = req.body;

    // Check if username and password are provided only for cashier employees
    if (employeeType === "cashier" && (!username || !password)) {
      return res.status(400).json({
        message: "Username and password are required for cashier employees",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      phoneNumber,
      employeeType,
      username,
      password: hashedPassword,
      address,
      isActive,
    });
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employees with optional pagination and search
exports.getAllEmployees = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { name: searchRegex }, // Search by name
          { phoneNumber: searchRegex }, // Search by phone number
          { username: searchRegex }, // Search by username
          { employeeType: searchRegex }, // Search by employee type
        ],
      };
    }

    if (!page || !limit) {
      const employees = await Employee.find(query);
      const count = employees.length; // Get the count of all employees
      res.json({
        data: employees,
        totalRecords: count,
        currentPage: 1, // Since all records are on one page
      });
    } else {
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;

      const employees = await Employee.find(query)
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .exec();

      const count = await Employee.countDocuments(query);
      res.json({
        data: employees,
        totalRecords: count,
        currentPage: pageNumber,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      employeeType,
      username,
      password,
      address,
      isActive,
    } = req.body;

    // Check if username already exists for another employee
    const existingEmployee = await Employee.findOne({
      username,
      _id: { $ne: req.params.id },
    });
    if (existingEmployee) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password if provided
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phoneNumber,
        employeeType,
        username,
        password: hashedPassword,
        address,
        isActive,
      },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update isActive status of an employee by ID
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
