const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'manager'], required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  position: { type: String },
  phone: { type: String },
  dob: { type: Date },
  address: { type: String },
  dateOfJoining: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

