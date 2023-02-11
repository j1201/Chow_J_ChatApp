const express = require('express'); // import the express package
const app = express(); // create an express app
const http = require('http'); // import the Node server package
const server = http.createServer(app); // use our app file with the server

// add in the Socket.io server stuff
const { Server } = require("socket.io");
const io = new Server(server);

// store the connected users in server
var connectedUsers = [];

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// set up the server to listen for incoming connections at this port
server.listen(port, () => {
  console.log(`listening on ${port}`);
});

// socket.io script goes here
io.on('connection', (socket) => {
    console.log('chat user connected');
    socket.emit('connected', { sID: socket.id, message: 'new connection'});

    socket.on('join_room', users => {

      // subscribe the user to the selected chat room
      socket.join(users.room);
      console.log(`user joined room: ${users.room}`);

      // check if there's a list of connected users for the room; 
      // create a new room if not
      if (!connectedUsers[users.room]) {
        connectedUsers[users.room] = [];
      }

      // add the new user to the connectedUsers array
      connectedUsers[users.room].push({
        username: users.user,
        id: socket.id,
        room: users.room
      });

      // update the connectedUsers array - userList
      io.to(users.room).emit('user_list', connectedUsers[users.room])

      // broadcast a message to the group when someone connects
      io.to(users.room).emit('user_join', users.user)

    })

    // Receive incoming messages
    socket.on('chat_message', function(msg) {
      console.log(msg); // have a look at the message data

      // Rebroadcase the current message to everyone connected to our chat service
      // it gets sent to all users, including the original message creator
      io.to(msg.room).emit('new_message', { message: msg});
      
    })

    // Function typing_event - catch incoming custom event 
    socket.on('typing_event', function(user) { 
      io.to(user.room).emit('typing', user)
    })

    // Listen to disconnect event
    socket.on('disconnect', () => {
      console.log(socket.id);
      console.log(connectedUsers);

      // Iterate over the elements(room) of the connectedUsers array
      // Filter out the disconnected user and update the user list in that room
      Object.keys(connectedUsers).forEach(room => {
        connectedUsers[room] = connectedUsers[room].filter(user => user.id !== socket.id);
        io.to(room).emit('user_list', connectedUsers[room]);
      });
      
    });

});

