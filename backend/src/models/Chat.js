const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    name: { type: String },                 // optional: group name
    isGroup: { type: Boolean, default: false },
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // participants
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
