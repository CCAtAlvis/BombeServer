const indexRouter = require('./index');
const usersRouter = require('./users');
const actionRouter = require('./action');
const staff = require('./staff');
const api = require('./api');
const patient = require('./patient');

const initRoutes = (app) => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/action', actionRouter);
  app.use('/staff', staff);
  app.use('/api', api);
  app.use('/patient', patient);
}

module.exports = initRoutes;
