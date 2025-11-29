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

router.post('/create', auth, async (req, res) => {
  try {
    const { userIds, isGroup, name } = req.body;

    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ error: "User IDs required" });
    }

    // Ensure current user is included
    if (!userIds.includes(req.user.id.toString())) {
      userIds.push(req.user.id);
    }

    const chat = await Chat.create({
      users: userIds,
      isGroup,
      name: isGroup ? name || "New Group" : null,
    });

    const fullChat = await Chat.findById(chat._id)
      .populate("users", "username");

    return res.json(fullChat);
  } catch (err) {
    console.error("❌ Chat create error:", err);
    res.status(500).json({ error: "Failed to create chat" });
  }
});



module.exports = router;
