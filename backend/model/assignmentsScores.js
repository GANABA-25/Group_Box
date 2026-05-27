const mongoose = require("mongoose");
const { Schema } = mongoose;
const xpBreakdown = require("../model/Gamification/xpBreakdown");
const assignmentScoreSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Groups",
      required: true,
    },
    contentQuality: {
      type: Number,
      required: true,
    },
    organizationStructure: {
      type: Number,
      required: true,
    },
    teamwork: {
      type: Number,
      required: true,
    },
    overallPresentation: {
      type: Number,
      required: true,
    },
    bonusPoints: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    totalGroupScore: {
      type: Number,
      required: true,
    },
    individualScore: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        contributionScore: {
          type: Number,
          required: true,
        },
        qualityScore: {
          type: Number,
          required: true,
        },
        collaborationScore: {
          type: Number,
          required: true,
        },
        bonusPoints: {
          type: Number,
          required: true,
        },
        feedback: {
          type: String,
          required: true,
        },
        totalIndividualScore: {
          type: Number,
          required: true,
        },
      },
    ],

    groupXPBreakdown: xpBreakdown,
    individualXPBreakdown: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "User" },
        xpBreakdown: xpBreakdown,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentScore", assignmentScoreSchema);
