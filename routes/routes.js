const indexRouter = require('./index');
const usersRouter = require('./users');
const actionRouter = require('./action');
const staff = require('./staff');

const initRoutes = (app) => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/action', actionRouter);
  app.use('/staff', staff);
}

module.exports = initRoutes;
