const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png",
  },
  schoolEmail: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },

  passwordLastResetAt: {
    type: Date,
    default: null,
  },
  hasResetPassword: {
    type: Boolean,
    default: false,
  },
  createdGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  joinedGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  userGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  stats: {
    totalGroups: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    hoursWorked: {
      type: Number,
      default: 0,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
