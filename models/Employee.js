const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  employeeType: {
    type: String,
    enum: ["cashier", "admin", "waiter", "chef"],
    required: true,
  },
  username: {
    type: String,

    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
