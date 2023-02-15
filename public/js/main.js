// imports go at the top
import ChatMsg from'./components/ChatMessage.js';
var socket = io();

// utility function for socket
function setUserID({ sID }) {
  // save our unique ID generated by Socket on the server side
  vm.socketID = sID;
}

// utility functions for socket
function addNewMessage(message) {
  vm.messages.push(message);
  document.querySelector('.is-typing').innerHTML = '';
  document.querySelector('.user-join').innerHTML = ''

}

// show who is typing
function handleTypingEvent(user) {
  document.querySelector('.is-typing').innerHTML = user.user + ' is typing...'
}

// show who joins the room
function newUser(user) {
  document.querySelector('.user-join').innerHTML = user + ' has joined the chat.'
}

// show who leaves the room
function leftUser(user) {
  document.querySelector('.user-join').innerHTML = user.username + ' has left the chat.'
}


const { createApp } = Vue

const vm = createApp({

    data() {
      return {
        socketID: '',
        message: '',
        messages: [],
        currentUser: '',
        roomName: '',
        joinRoom: true,
        chatRoom: false,
        userList: [],
        selectedAvatar: ''
      }
    },

    mounted() {
      socket.on('user_list', (userList) => {
        this.userList = userList;
      })
    },
    
    methods: {
      userJoin() {

        socket.emit('join_room', {
          id: this.socketID,
          room: this.roomName,
          user: this.currentUser
        });

        this.joinRoom = false;
        this.chatRoom = true;

      },

      dispatchMessage() {
        console.log('send a message to the chat service');

        // data that sent to the server
        socket.emit('chat_message', { 
          content: this.message, 
          user: this.currentUser,
          id: this.socketID,
          img: this.selectedAvatar,
          room: this.roomName
        });

        this.message = '';
      },

      dispatchTypingEvent () {
        // send the typing notification to the server
        socket.emit('typing_event', {
          user: this.currentUser,
          room: this.roomName
        })
      },

      userLeft() {
        window.location.reload();
      }
    },

    components: {
        newmsg: ChatMsg
    }

  }).mount('#app')

  socket.addEventListener('connected', setUserID);
  socket.addEventListener('new_message', addNewMessage);
  socket.addEventListener('typing', handleTypingEvent);
  socket.addEventListener('user_join', newUser);
  socket.addEventListener('user_left', leftUser);

