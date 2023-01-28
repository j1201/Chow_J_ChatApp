// imports go at the top
import ChatMsg from'./components/ChatMessage.js';
var socket = io();

// utility functions for socket
function addNewMessage(message) {
    vm.messages.push(message);
}

const { createApp } = Vue

const vm = createApp({
    data() {
      return {
        message: '',
        messages: []
      }
    },

    methods: {
        dispatchMessage() {
            console.log('send a message to the chat service');

            socket.emit('chat_message', { content: this.message, user: this.username || 'anonymous'});

            this.message = '';
        }
    },

    components: {
        newmsg: ChatMsg
    }

  }).mount('#app')

  socket.addEventListener('new_message', addNewMessage);