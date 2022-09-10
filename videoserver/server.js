const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const bodyParser = require('body-parser');
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
    path: '/',
});

app.use("/peerjs", peerServer);

const io = require('socket.io')(httpServer, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        transport: ["websocket"],
        credentials: true
    }
});




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

io.on('connection', (socket) =>{
    console.log("new user connected", socket.id)

    socket.on("disconnect", (roomId) =>{
        socket.disconnect()
        socket.broadcast.to(roomId).emit("user-disconnected", socket.id)
        console.log("userdisconnected", socket.id)
    })

    // const clients = io.sockets.adapter.rooms.get('Room Name');

    socket.on('check-user', ({ roomId, userName }) => {
        let error = false;
        var clients = io.sockets.adapter.rooms.get(roomId.groupName);
        
        clients?.forEach((client) => {
        if (socketList[client] == userName) {
            error = true;
        }
        });
        socket.emit('error-user-exist', { error });
       
      });

    
      socket.on('join-room', ({roomId, userId}) =>{
        socket.join(roomId);
        socketList[socket.id] = { userName, video: true, audio: true };
        socket.broadcast.to(roomId).emit('user-connected', userId)

        io.of("/").in(roomId).clients((err, clients) => {
            try {
                const users = [];
                clients.forEach((client) => {
        
                users.push({ userId: client, info: socketList[client] });
              });
                socket.broadcast.to(roomId).emit('user-join', users);
            } catch (e) {
                io.of("/").in(roomId).emit('error-user-exist', { err: true });
            }
          });
      })

    socket.on("call-user", ({signal, to}) => {
        io.to(userTo).emit('receive call', {
            signal,
            from,
            info: socketList[socket.id],
        });
    });

    socket.on("accept-call", ({signal, to}) =>{
        io.to(to).emit('call accepted', {
            signal,
            answerId: socket.id,
        })
    })


    socket.on('leave-room', ({ roomId, leaver }) => {
        delete socketList[socket.id];
        socket.broadcast
          .to(roomId)
          .emit('user-leave', { userId: socket.id, userName: [socket.id] });
        io.sockets.sockets[socket.id].leave(roomId);
      });


    //messages sockets
    socket.on('send-message', ({ roomId, msg, sender }) => {
        io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
      });
    

      //media sockets
    socket.on('toggle-camera-audio', ({ roomId, switchTarget }) => {
    if (switchTarget === 'video') {
        socketList[socket.id].video = !socketList[socket.id].video;
    } else {
        socketList[socket.id].audio = !socketList[socket.id].audio;
    }
        socket.broadcast
        .to(roomId)
        .emit('toggle-camera', { userId: socket.id, switchTarget });
    });
  

    //editor collabsetup
    socket.on('join-editor', (data) =>{
        socket.join(data.groupId)
    })

    socket.on('editor-data', (data) =>{
        socket.broadcast.to(data.groupId).emit('editor-data', data);
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


})

const port  = 5001

httpServer.listen(port,console.log("video server listening on port", port))