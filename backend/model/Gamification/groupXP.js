const mongoose = require("mongoose");
const xpBreakdown = require("../Gamification/xpBreakdown");

const groupXPSchema = new mongoose.Schema(
  {
    groupCode: {
      type: String,
      ref: "Group",
      required: true,
      unique: true,
    },
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xpHistory: [
      {
        groupName: { type: String, required: false },
        assignmentTitle: { type: String, required: false },
        action: { type: String, required: true },
        description: { type: String, required: true },
        xpAwarded: { type: Number, required: true },
        xpBreakdown: xpBreakdown,
        relatedAssignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assignment",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    badges: [
      {
        name: String,
        description: String,
        icon: String,
        xpAwarded: Number,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupXP", groupXPSchema);
