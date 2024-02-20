const Table = require("../models/Table");

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { tableName, isReserved, isAllocated, isActive } = req.body;

    // Check if the table name already exists
    const existingTable = await Table.findOne({ tableName });
    if (existingTable) {
      return res.status(400).json({ message: "Table name already exists" });
    }

    const table = new Table({ tableName, isReserved, isAllocated, isActive });
    const savedTable = await table.save();
    res.status(201).json(savedTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all tables where isReserved is false and isAllocated is false
exports.getAllFreeTables = async (req, res) => {
  try {
    const tables = await Table.find({ isReserved: false, isAllocated: false });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
