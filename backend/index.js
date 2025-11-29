const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.js');
const chatRoutes = require('./src/routes/chats.js');
const messageRoutes = require('./src/routes/messages');
const userRoutes = require('./src/routes/users');
const Message = require('./src/models/Message');
const Chat = require('./src/models/Chat');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);
// app.use('/chats', require('./routes/chats'));
// app.use('/users', require('./routes/users'));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Join a specific chat room
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  // Handle incoming messages
  socket.on('sendMessage', async ({ chatId, senderId, content }) => {
    try {
      console.log('📩 Message received:', { chatId, senderId, content });

      // Save message to database
      const message = await Message.create({
        chat: chatId,
        sender: senderId,
        content,
      });

      // Populate sender info
      await message.populate('sender', 'username');

      // Update chat's latestMessage
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      // Emit to all users in this chat room
      io.to(chatId).emit('newMessage', {
        _id: message._id,
        chat: message.chat,
        sender: message.sender,
        content: message.content,
        createdAt: message.createdAt,
      });

      console.log('✅ Message saved and emitted');
    } catch (error) {
      console.error('❌ Error saving message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
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