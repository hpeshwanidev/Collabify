const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../frontend')));

const users = {};

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };

        
        // Send user list to room
        const roomUsers = Object.values(users).filter(user => user.room === room);
        io.to(room).emit('roomUsers', {
            room: room,
            users: roomUsers.map(user => user.username)
        });

        
        //  Broadcast to room that user has joined
        socket.to(room).emit('message', {
            username: 'System',
            text: `${username} has joined the chat`
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit('message', {
                username: user.username,
                text: msg
            });
        }
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            const room = user.room;
            const username = user.username;
            delete users[socket.id];

            // Broadcast user left to room
            socket.to(room).emit('message', {
                username: 'System',
                text: `${username} has left the chat`
            });

            // Update room users
            const roomUsers = Object.values(users).filter(user => user.room === room);
            io.to(room).emit('roomUsers', {
                room: room,
                users: roomUsers.map(user => user.username)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));