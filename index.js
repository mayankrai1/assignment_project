const config = require('./config/config');
const app = require('./config/express');
const http = require('http').createServer(app);
// const socketio = require('socket.io')(http);
require('./config/mongoose');

// require('./routes/chat.route').refreshWeather(socketio);
http.listen(config.port, () => {
  // app.listen(process.env.PORT || 5000, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
  // });
})

module.exports = app;