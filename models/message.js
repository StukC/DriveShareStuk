const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
