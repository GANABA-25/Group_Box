const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupMemberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  schoolEmail: {
    type: String,
    required: true,
  },
  isLeader: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = groupMemberSchema;
