const express = require('express');
const PORT = process.env.PORT || 5001;
const path = require('path');
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

let socketList = {};

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.get('/ping', (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

io.on('connection', (socket) => {
  console.log(`New User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('User disconnected!');
  });

  socket.on('BE-check-user', ({ roomId, userName }) => {
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error });
    });
  });

  socket.on('BE-join-room', ({ roomId, userName }) => {
 
    socket.join(roomId);
    socketList[socket.id] = { userName, video: true, audio: true };

    io.sockets.in(roomId).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
  
          users.push({ userId: client, info: socketList[client] });
        });
        socket.broadcast.to(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
      }
    });
  });

  socket.on('BE-call-user', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('FE-receive-call', {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {
    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });

  socket.on('BE-send-message', ({ roomId, msg, sender }) => {
    io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
  });

  socket.on('BE-leave-room', ({ roomId, leaver }) => {
    delete socketList[socket.id];
    socket.broadcast
      .to(roomId)
      .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
    io.sockets.sockets[socket.id].leave(roomId);
  });

  socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
    if (switchTarget === 'video') {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
  });
});

httpServer.listen(PORT, () => {
  console.log('Connected : 5001');
});