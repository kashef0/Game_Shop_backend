const Message = require('../models/message');

// Hämtar alla meddelanden för den inloggade användaren
exports.getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;  
    // Hämta alla meddelanden för denna användare sorterade efter nyast först
    const messages = await Message.find({ userId }).sort({ createdAt: -1 });

    res.json(messages);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hämtar alla meddelanden i systemet (för admin)
exports.getAllMessages = async (req, res) => {
  try {
    // Hämta alla meddelanden sorterade efter nyast först
    const messages = await Message.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Skickar ett nytt meddelande från användaren till admin
exports.sendMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;  
    const userId = req.user.id;            

    // Kontrollera att ämne och meddelande finns
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    // Skapa ett nytt meddelande med användarens id ämne och meddelande
    const newMessage = new Message({
      userId,
      subject,
      message,
    });

    await newMessage.save(); 
    res.status(201).json({ message: 'Message sent successfully', message: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin svarar på ett meddelande
exports.replyMessage = async (req, res) => {
  try {
    // Kontrollera att den inloggade användaren är admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { messageId } = req.params;  
    const { reply } = req.body;     

    // Kontrollera att svar finns
    if (!reply) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    // Hämta meddelandet från databasen med hjälp av id
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Lägg till admin svaret och tidpunkt för svaret
    message.adminReply = reply;
    message.repliedAt = new Date();

    await message.save(); 

    res.json({ message: 'Reply sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
