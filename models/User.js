const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'employee', 'manager'], required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  position: { type: String },
  phone: { type: String ,required: false,  unique: true,   sparse: true },
  dob: { type: Date },
  address: { type: String },
  dateOfJoining: { type: Date },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null } 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

