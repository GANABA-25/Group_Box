const mongoose = require("mongoose");
const xpBreakdown = require("../Gamification/xpBreakdown");

const studentXPSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xpHistory: [
      {
        groupName: String,
        assignmentTitle: String,
        action: String,
        description: String,
        xpAwarded: Number,
        xpBreakdown: xpBreakdown,
        date: { type: Date, default: Date.now },
        relatedAssignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assignment",
        },
      },
    ],

    badges: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
        },
        xpAwarded: {
          type: Number,
          default: 0,
        },
        awardedAt: {
          type: Date,
          default: Date.now,
        },
      },
      { _id: false },
    ],

    submissionHistory: [
      {
        assignmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assignment",
        },
        assignmentTitle: String,
        groupName: String,
        submittedAt: Date,
        dueDate: Date,
        student_score: Number,
        participated: Boolean,
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentXP", studentXPSchema);
