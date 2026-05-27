const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  senderName: { type: String, required: true },
  senderGroupCode: { type: String },
  receiverGroupName: { type: String },
});

module.exports = notificationSchema;
