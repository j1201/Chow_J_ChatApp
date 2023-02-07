const express = require('express'); // import the express package
const app = express(); // create an express app
const http = require('http'); // import the Node server package
const server = http.createServer(app); // use our app file with the server

// add in the Socket.io server stuff
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

// this is a route handler -> listen for incoming requests and send back a response
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/index', (req, res) => {
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

    socket.on('user_info', function(info) { 
      console.log(info);
    })

    // step 1 - receive incoming messages
    socket.on('chat_message', function(msg) {
      console.log(msg); // have a look at the message data

      // step 2 
      // rebroadcase the current message to everyone connected to our chat service
      // it gets sent to all users, including the original message creator
      io.emit('new_message', { message: msg});
    })

    // function typing_event - catch incoming custom event 
    socket.on('typing_event', function(user) { 
      io.emit('typing', user)
    })
});

