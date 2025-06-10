document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const messageContainer = document.getElementById('message-container');
  const usernameForm = document.getElementById('username-form');
  const usernameInput = document.getElementById('username-input');
  const usernameModal = document.getElementById('username-modal');
  const statusIndicator = document.getElementById('status');

  // Socket.IO connection
  const socket = io();
  let currentUser = '';

  // Connection status
  socket.on('connect', () => {
    statusIndicator.textContent = 'Connected';
    usernameModal.style.display = 'flex';
  });

  socket.on('disconnect', () => {
    statusIndicator.textContent = 'Disconnected';
  });

  // Username submission
  usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    
    if (username) {
      currentUser = username;
      socket.emit('new-user', username);
      usernameModal.style.display = 'none';
      messageInput.disabled = false;
      messageInput.focus();
      messageForm.querySelector('button').disabled = false;
    }
  });

  // Message submission
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
      appendMessage(message, 'user', currentUser);
      socket.emit('send-message', message);
      messageInput.value = '';
    }
  });

  // Incoming messages
  socket.on('receive-message', (data) => {
    appendMessage(data.text, 'other', data.user, data.time);
  });

  // User connections/disconnections
  socket.on('user-connected', (username) => {
    appendSystemMessage(`${username} joined the chat`);
  });

  socket.on('user-disconnected', (username) => {
    appendSystemMessage(`${username} left the chat`);
  });

  // Helper functions
  function appendMessage(text, type, sender, time = new Date().toLocaleTimeString()) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    
    messageElement.innerHTML = `
      <div class="message-info">${sender} • ${time}</div>
      <div>${text}</div>
    `;
    
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  function appendSystemMessage(text) {
    const systemMessage = document.createElement('div');
    systemMessage.classList.add('system-message');
    systemMessage.textContent = text;
    messageContainer.appendChild(systemMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
});
