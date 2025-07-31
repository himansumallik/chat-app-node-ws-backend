import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PORT = 7000

const app = express();
const server = http.createServer(app)
const __dirname = dirname(fileURLToPath(import.meta.url));
const io = new Server(server);

// Store active users and their nicknames
const users = {}; // Map socket.id to nickname

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Function to emit the updated user list to all clients
function emitUserList() {
    io.emit('update-user-list', Object.values(users));
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 1. User Nickname and Join Notification
    socket.on('set-nickname', (nickname) => {
        users[socket.id] = nickname;
        console.log(`User ${socket.id} set nickname to: ${nickname}`);
        // Notify all users about the new joiner
        io.emit('user-joined', nickname);
        // Emit updated user list after a new user joins
        emitUserList();
    });

    // 2. Chat Message with Nickname
    socket.on('chat-message', (msg) => {
        const nickname = users[socket.id] || 'Anonymous'; // Get nickname, default to Anonymous
        console.log(`Message from ${nickname} (${socket.id}): ${msg}`);
        io.emit('chat-message', { nickname: nickname, message: msg });
    });

    // 3. Typing Indicator
    socket.on('typing', (isTyping) => {
        const nickname = users[socket.id] || 'Anonymous';
        // Broadcast to everyone *except* the sender
        socket.broadcast.emit('user-typing', { nickname: nickname, isTyping: isTyping });
    });

    // 4. Disconnect (User Leave Notification)
    socket.on('disconnect', () => {
        const nickname = users[socket.id];
        console.log('A user disconnected:', socket.id);
        if (nickname) {
            delete users[socket.id]; // Remove user from our list
            io.emit('user-left', nickname); // Notify all users
            // Emit updated user list after a user leaves
            emitUserList();
            console.log(`User ${nickname} (${socket.id}) disconnected.`);
        }
    });

    // When a new client connects, immediately send them the current user list
    // This handles cases where a user joins an already populated chat
    socket.emit('update-user-list', Object.values(users));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});