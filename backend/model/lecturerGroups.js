const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = require("./notification");

const lecturerGroupSchema = new Schema({
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
  studentGroups: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Groups",
      },
    ],
    default: [],
  },
  notifications: [notificationSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
});

lecturerGroupSchema.virtual("studentGroupCount").get(function () {
  return (this.studentGroups || []).length;
});

lecturerGroupSchema.set("toObject", { virtuals: true });
lecturerGroupSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("lecturerGroups", lecturerGroupSchema);
