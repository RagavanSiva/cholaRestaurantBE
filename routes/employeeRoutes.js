const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Create a new employee
router.post("/", employeeController.createEmployee);

// Get all employees
router.get("/", employeeController.getAllEmployees);

// Get a single employee by ID
router.get("/:id", employeeController.getEmployeeById);

// Update an employee by ID
router.put("/:id", employeeController.updateEmployee);

// Update isActive status of an employee by ID
router.put("/status/:id", employeeController.updateEmployeeStatus);

// Delete an employee by ID
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
