// require mandatory modules
const express = require('express');

// require routings
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// create express app
const app = express();

// initialize WebSockets routing
const initWS = require('./controllers/wsController');
initWS();

// // start TURN server
// const TURN = require('./controllers/turnController');
// TURN.initTURN();

// init middlewares
const middleware = require('./config/middleware');
middleware(app);

// init database
const database = require('./config/database');
database();

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
