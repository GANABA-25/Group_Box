const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupMember = require("./groupMember");
const notificationSchema = require("./notification");
const assignmentSchema = require("./assignment");

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  groupCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [groupMember],
  notifications: [notificationSchema],
  joinedLecturerGroup: {
    type: Schema.Types.ObjectId,
    ref: "lecturerGroups",
  },

  documentId: { type: String, required: true },

  taskCompleted: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

groupSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

groupSchema.set("toObject", { virtuals: true });
groupSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Groups", groupSchema);
