const mongoose = require("mongoose");

const ResignationSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lwd: { type: String, required: true }, // Format: "YYYY-MM-DD"
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Resignation", ResignationSchema);