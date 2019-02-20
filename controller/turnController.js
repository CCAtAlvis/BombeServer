const Turn = require('node-turn');

const configuration = {
  listeningPort: 9999,
  minPort: 1000,
  maxPort: 65535,
  authMech: "long-term",
  credentials: {
    username: "password",
    bombe: "bombe"
  },
  debugLevel: "ERROR",
}

const server = new Turn(configuration);

module.exports.initTURN = () => {
  console.log(`Starting TURN service at port: ${configuration.listeningPort}`);
  server.start();
  console.log(`TURN service UP and RUNNING at port: ${configuration.listeningPort}`);
}
