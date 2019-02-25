const indexRouter = require('./index');
const usersRouter = require('./users');

const initRoutes = (app) => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
}

module.exports = initRoutes;
