const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');

let ws, wss;
let httpsServer, httpServer;

// create a secure web socket
if (process.env.NODE_ENV == 'prod') {
  var privateKey  = fs.readFileSync('/etc/letsencrypt/live/bombe.westindia.cloudapp.azure.com/privkey.pem', 'utf8');
  var certificate = fs.readFileSync('/etc/letsencrypt/live/bombe.westindia.cloudapp.azure.com/cert.pem', 'utf8');
  var ca = fs.readFileSync('/etc/letsencrypt/live/bombe.westindia.cloudapp.azure.com/chain.pem', 'utf8');  
  var credentials = {key: privateKey, cert: certificate, ca: ca};
  httpsServer = https.createServer(credentials);
  wss = new WebSocket.Server({ httpsServer });
}

// create a normal websocket
httpServer = http.createServer();
ws = new WebSocket.Server({ noServer: true });


// list of clients
let wsclients = [];


// TODO
// properly merge both WSS and WS!
// SUPER DAMN IMPORTANT

// handle WSS
if (process.env.NODE_ENV == 'prod') {
  wss.on('connection', (ws) => {
    // TODO:
    // proper handling of ws clients by inserting in DB
    wsclients.push(ws);
    console.log('client connected');
    console.log(ws._socket.remoteAddress);

    ws.on('message', (message) => {
      console.log(message);
      // console.log('sending to all clients');

      // TODO
      // fetch clients from DB

      wsclients.forEach(c => {
        if (c.readyState === c.OPEN && c !== ws) {
          c.send(message);
        } else {
          // TODO:
          // splice the array here
        }
      });
    });
  });
}

// handle WS
ws.on('connection', (ws) => {
  // TODO:
  // proper handling of ws clients by inserting in DB
  wsclients.push(ws);
  console.log('client connected');
  console.log(ws._socket.remoteAddress);

  ws.on('message', (message) => {
    console.log(message);
    // console.log('sending to all clients');

    // TODO
    // fetch clients from DB

    wsclients.forEach(c => {
      if (c.readyState === c.OPEN && c !== ws) {
        c.send(message);
      } else {
        // TODO:
        // splice the array here
      }
    });
  });
});


const initWS = () => {
  // app.use("/ws", router);
  httpServer.listen(8000);

  if (process.env.NODE_ENV == 'prod') {
    httpsServer.listen(8443);
  }
}

module.exports = initWS;
