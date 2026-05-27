const mongoose = require("mongoose");
const { Schema } = mongoose;

const xpBreakdownSchema = new Schema(
  {
    submittingAssignmentOnTimeXP: { type: Number, default: 0 },
    submittingAssignmentBeforeDueDateXP: { type: Number, default: 0 },
    scoreThresholdXP: { type: Number, default: 0 },
    participationXP: { type: Number, default: 0 },
    charsXP: { type: Number, default: 0 },
    bonusXP: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
  },
  { _id: false }
);

module.exports = xpBreakdownSchema;
