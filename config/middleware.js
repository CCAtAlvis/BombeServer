const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const initMiddleware = (app) => {
  dotenv.config();

  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));

  // usage variables
  // app.use((req, res, next) => {
  // 	res.locals.req = req;
  // 	res.locals.session = req.session;
  // 	res.locals.toastMessage = req.flash('toastMessage');
  //  res.locals.toastStatus = req.flash('toastStatus');

  // 	if (res.locals.toastMessage != "" && res.locals.toastStatus != "") {
  // 	  console.log('Flash Message: '+res.locals.toastMessage+' '+res.locals.toastStatus);
  // 	}

  //   next();
  // });

  // Handling session 
  // session config
  const sessionConfig = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: false,
      maxAge: 3600 * 24 * 365
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 3600 * 24 * 365,
      autoRemove: 'interval',
      autoRemoveInterval: 10, // 10 minutes, default
      touchAfter: 24 * 3600, // time period in seconds
      collection: 'sessions'
    })
  };

  app.use(session(sessionConfig));

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

module.exports = initMiddleware;
