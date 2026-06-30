const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "done"],
      default: "todo",
    },
    assignedTo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);