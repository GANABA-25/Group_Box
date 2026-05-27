const mongoose = require(mongoose);

const Schema = mongoose.Schema;

const rankingSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },

  groupDescription: {
    type: String,
    required: true,
  },

  groupMembers: [
    {
      image: {
        type: string,
        required: true,
      },
    },
  ],

  groupScore: {
    type: Number,
    required: true,
  },

  groupTaskCompleted: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Rankings", rankingSchema);
