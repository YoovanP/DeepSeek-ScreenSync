// server/netlify-functions/signaling.js
const { Server } = require('socket.io');

let io;

exports.handler = async (event, context) => {
  if (!io) {
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    const rooms = new Map();
    
    io.on('connection', (socket) => {
      console.log(`New connection: ${socket.id}`);
      
      socket.on('join', (roomId) => {
        socket.join(roomId);
        const room = rooms.get(roomId) || { viewers: [] };
        room.viewers.push(socket.id);
        rooms.set(roomId, room);
        
        socket.emit('joined', roomId);
        io.to(roomId).emit('viewerCount', room.viewers.length);
      });
      
      socket.on('host-ready', (roomId) => {
        socket.to(roomId).emit('host-ready');
      });
      
      socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data.offer);
      });
      
      socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data.answer);
      });
      
      socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data.candidate);
      });
      
      socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
          room.viewers = room.viewers.filter(id => id !== socket.id);
          if (room.host === socket.id) {
            io.to(roomId).emit('host-disconnected');
            rooms.delete(roomId);
          } else {
            io.to(roomId).emit('viewerCount', room.viewers.length);
          }
        });
      });
    });
  }
  
  return {
    statusCode: 200,
    body: 'WebSocket server running'
  };
};