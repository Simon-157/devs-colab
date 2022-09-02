const express = require('express');
const app = express();
const http = require('http');
const {Server} = require("socket.io");
const httpServer = http.createServer(app);
const bodyParser = require('body-parser');
const {ExpressPeerServer} = require('peer');

const io = require('socket.io')(httpServer, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        transport: ["websocket"],
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
    path: '/',
});

app.use("/peerjs", peerServer);


//connected user utility functions
var onlineUsers = []
const addUser = (userId, socketId) => {
    if(!onlineUsers.some(user => user.userIdv === userId)){
        onlineUsers.push({
            userId, socketId
        })
    }
}
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
  }
  
const getUser = (userId)=> {
return onlineUsers.find(user => user.userId === userId)
}

io.on('connection', socket =>{
    socket.on('join-editor', (data) =>{
        socket.join(data.groupId)
    })

    socket.on('editor-data', (data) =>{
        socket.broadcast.to(data.groupId).emit('editor-data', data);
    })

    socket.on('join-room', (data) =>{
        socket.join(data.groupId);
        socket.broadcast.to(data.groupId).emit('user-connected', data)
    })

    socket.on('newUser', (userId) =>{
        addUser(userId, socket.id)

    })

    socket.on('sendNotification', ({sender, receiver, group}) => {
        const receiverUser = getUser(receiver)
        socket.broadcast.emit("receiveNotification", {sender, group})
    })

    socket.on('send-peer-data', (data) => {
        socket.braodcast.to(data.groupId).emit("send-peer-data", data)
    })

    socket.on("connected-user-handle", (data) => {
        socket.braodcast.to(data.groupId).emit("connected-user-handle", data)
    })

    socket.on("user-disconnected", (data) =>{
        removeUser(socket.id)
        socket.broadcast.to(data.groupId).emit("user-disconnected", data)
        socket.leave(data.groupId)
    })
})

const port  = 5001

httpServer.listen(port,console.log("video server listening on port", port))