const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deletedAt: { type: Date, default: null }  // Thêm trường deletedAt
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);
