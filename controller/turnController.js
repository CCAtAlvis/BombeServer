const Turn = require('node-turn');

const configuration = {
  listeningPort: 9999,
  listeningIps: ['172.27.239.209', '172.26.64.1', '192.168.56.1', '192.168.1.104'],
  minPort: 1000,
  maxPort: 65535,
  authMech: "none",
  // credentials: {
  //   username: "password",
  //   bombe: "bombe"
  // },
  debugLevel: "ERROR",
}

const server = new Turn(configuration);

module.exports.initTURN = () => {
  console.log(`Starting TURN service at port: ${configuration.listeningPort}`);
  server.start();
  console.log(`TURN service UP and RUNNING at port: ${configuration.listeningPort}`);
}
