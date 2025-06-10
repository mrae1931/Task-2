const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Initialize socket events
socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
