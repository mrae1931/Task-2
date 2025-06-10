module.exports = (io) => {
  const users = {};
  
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // User joins
    socket.on('new-user', (username) => {
      users[socket.id] = username;
      socket.broadcast.emit('user-connected', username);
    });

    // Message handling
    socket.on('send-message', (message) => {
      socket.broadcast.emit('receive-message', {
        user: users[socket.id],
        text: message,
        time: new Date().toLocaleTimeString()
      });
    });

    // User disconnects
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id]);
      delete users[socket.id];
    });
  });
};
