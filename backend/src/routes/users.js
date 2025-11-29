const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Search users by username
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    console.log('🔍 Search request received:', { query, userId: req.user.id });
    
    if (!query || query.trim().length === 0) {
      console.log('⚠️ Empty query, returning empty array');
      return res.json([]);
    }

    // Search for users whose username contains the query (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user.id } // Exclude current user
    })
    .select('_id username') // Only return id and username
    .limit(10); // Limit to 10 results

    console.log(`✅ User search for "${query}":`, users.length, 'results found');
    console.log('Users:', users.map(u => ({ id: u._id, username: u.username })));
    
    res.json(users);
  } catch (e) {
    console.error('❌ User search error:', e);
    res.status(500).json({ error: 'Server error', message: e.message });
  }
});

// Get all users (for testing/debugging)
router.get('/', auth, async (req, res) => {
  try {
    console.log('📋 Get all users request from:', req.user.id);
    
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('_id username')
      .limit(50);
    
    console.log(`✅ Found ${users.length} users`);
    res.json(users);
  } catch (e) {
    console.error('❌ Get users error:', e);
    res.status(500).json({ error: 'Server error', message: e.message });
  }
});

module.exports = router;