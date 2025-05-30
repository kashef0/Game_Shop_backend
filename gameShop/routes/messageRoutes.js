const express = require('express');
const router = express.Router();

const {
  sendMessage,
  replyMessage,
  getUserMessages,
  getAllMessages
} = require('../controllers/messageController');

const { protect, admin } = require('../middlewares/auth');

// route för användare att skicka meddelande till admin
router.post('/send', protect, sendMessage);

// route för användare att hämta sina egna meddelanden inkorg
router.get('/inbox', protect, getUserMessages);

// route för admin att hämta alla meddelanden i systemet
router.get('/all', protect, admin, getAllMessages);

// route för admin att svara på ett specifikt meddelande via messageId
router.put('/reply/:messageId', protect, admin, replyMessage);

module.exports = router;
