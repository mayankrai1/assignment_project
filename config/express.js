const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
// const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const routes = require('../routes/index.route');
const config = require('./config');
// const passport = require('./passport')
const app = express();


// const http = require('http');
// const socketio = require('socket.io');

if (config.env === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
// var distDir = '../../dist/';
// if (config.frontend == 'react') {
//   distDir = '../../node_modules/material-dashboard-react/dist'
// } else {
//   distDir = '../../dist/';
// }

// 
// app.use(express.static(path.join(__dirname, distDir)));
// app.use(/^((?!(api)).)*/, (req, res) => {
//   res.sendFile(path.join(__dirname, distDir + '/index.html'));
// });

// console.log(distDir);
//React server
// app.use(express.static(path.join(__dirname, '../../node_modules/material-dashboard-react/dist')))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
// app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// allowing CORS:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Acc' +
    'ess-Control-Request-Method, Access-Control-Request-Headers',
  );
  res.header('Cache-Control', 'no-cache');
  next();
});

// API router
app.use('/api/', routes);


// app.use(passport.initialize());
// require('./passport')
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(/^((?!(api)).)*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../../dist/index.html'));
// });
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new httpError(404)
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }
  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});
module.exports = app;
