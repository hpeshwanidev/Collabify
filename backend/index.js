const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.js');
const chatRoutes = require('./src/routes/chats.js'); // adjust path as you use
const messageRoutes = require('./src/routes/messages');

const app = express();
const server = http.createServer(app);

// Middleware (handles incoming requests)
app.use(cors()); // Allows frontend to connect
app.use(express.json()); // Parses JSON bodies
app.use('/auth',authRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your React dev URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // simple broadcast for now
  socket.on('message', (msg) => {
    // later: save to DB, include chatId, sender, etc.
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

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
