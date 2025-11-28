const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user.id })
      .populate('users', 'username')
      .populate('latestMessage');
    res.json(chats);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// helper to create a test chat
router.post('/', auth, async (req, res) => {
  try {
    const chat = await Chat.create({
      users: [req.user.id],
      name: 'Test chat',
    });
    res.json(chat);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
