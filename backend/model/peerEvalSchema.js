const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const peerEvalSchema = new Schema({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  groupCode: { type: String, required: true },

  targetEmail: { type: String, required: true },

  evaluations: [
    {
      evaluatorEmail: String,
      score: Number,
    },
  ],

  totalScore: Number,
  normalizedScore: Number,

  createdAt: { type: Date, default: Date.now },
});

peerEvalSchema.index(
  { assignmentId: 1, groupCode: 1, targetEmail: 1 },
  { unique: true }
);

module.exports = mongoose.model("PeerEvaluation", peerEvalSchema);
