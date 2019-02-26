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
  httpsServer = new https.createServer(credentials);
  wss = new WebSocket.Server({ server: httpsServer });
}

// create a normal websocket
httpServer = http.createServer();
ws = new WebSocket.Server({ server: httpServer });

// list of clients
let wsclients = [];

const onMessage = (message) => {
  let msg = JSON.parse(message);

  // msg = {
  //   type: 'new-connection',
  //   name: 'patient',
  //   id: 'unique-id'
  // }

  if (msg.type == 'new-connection') {
    msg['ws'] = ws;
    wsclients.push(msg);
  // } else if (msg.type == 'offer' || )
  } else {
    let msgFor = msg.to;
    for (let i in wsclients) {
      let c = wsclients[i].ws;
      if (c.readyState === c.OPEN) {
        if (c.id == msgFor) {
          c.send(message);
          break;
        }
      } else {
        // TODO:
        // splice the array here
      }
    }
  }

  console.log(message);
}

// handle WSS
if (process.env.NODE_ENV == 'prod') {
  wss.on('connection', (ws) => {
    console.log('client connected');

    ws.on('message', (message) => {
      onMessage(message);
    });
  });
}

// handle WS
ws.on('connection', (ws) => {
  console.log('client connected');

  ws.on('message', (message) => {
    onMessage(message);
  });
});

// init WebSockets
const initWS = () => {
  // app.use("/ws", router);
  httpServer.listen(8000);

  if (process.env.NODE_ENV == 'prod') {
    httpsServer.listen(8443);
  }
}

module.exports = initWS;
