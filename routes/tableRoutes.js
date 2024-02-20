const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// Create a new table
router.post("/", tableController.createTable);

// Get all tables
router.get("/", tableController.getAllTables);

router.get("/free", tableController.getAllTables);

module.exports = router;
