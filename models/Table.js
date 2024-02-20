const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true,
    unique: true,
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
  isAllocated: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Table", tableSchema);
