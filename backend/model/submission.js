const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  assignment: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  assignmentTitle: {
    type: String,
    required: true,
  },
  group: { type: Schema.Types.ObjectId, ref: "Groups", required: true },
  document: { type: String, ref: "Document", required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["submitted", "graded", "returned"],
    default: "submitted",
  },
  submittedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  grade: { type: Number },
  feedback: { type: String },
});

module.exports = mongoose.model("Submission", submissionSchema);
