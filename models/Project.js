const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['ongoing', 'completed', 'on-hold'], default: 'ongoing' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);