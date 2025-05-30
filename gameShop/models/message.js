const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {                
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  adminReply: {             
    type: String,
    default: '',
  },
  repliedAt: {              
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
