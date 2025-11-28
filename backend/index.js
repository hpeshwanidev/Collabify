const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.js');

const app = express();
const server = http.createServer(app);

// Middleware (handles incoming requests)
app.use(cors()); // Allows frontend to connect
app.use(express.json()); // Parses JSON bodies
app.use('/auth',authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Chat server running!' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
