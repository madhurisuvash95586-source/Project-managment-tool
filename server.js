require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const timeRoutes = require('./routes/time');

connectDB();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });

// attach io to req so routes can emit notifications
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time', timeRoutes);

// SOCKET.IO
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // join a project room
    socket.on('joinProject', (projectId) => {
        socket.join(`proj_${projectId}`);
        console.log(`User joined room proj_${projectId}`);
    });

    // leave a project room
    socket.on('leaveProject', (projectId) => {
        socket.leave(`proj_${projectId}`);
        console.log(`User left room proj_${projectId}`);
    });

    socket.on('disconnect', () => { });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server started on', PORT));
