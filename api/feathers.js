const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const socket = io('http://localhost:3030', {
  transports: ['websocket'],
  forceNew: true
}); //direccion de la api
const app = feathers();
app.configure(socketio(socket));

export default app;