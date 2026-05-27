const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contributionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String },
    userEmail: { type: String },
    chars: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const documentSchema = new Schema({
  _id: { type: String },
  data: { type: Object, default: "" },

  files: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      size: { type: Number, required: true },
      uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  contributions: [contributionSchema],
  totalChars: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Document", documentSchema);
