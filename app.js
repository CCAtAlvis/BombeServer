// require mandatory modules
const express = require('express');

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
const routes = require('./routes/routes');
routes(app);

module.exports = app;
