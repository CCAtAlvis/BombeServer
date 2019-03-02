const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');

let ws, wss;
let httpsServer, httpServer;

// create a secure web socket
if (process.env.NODE_ENV == 'prod') {
  const privateKey  = fs.readFileSync('/etc/letsencrypt/live/bombe.westindia.cloudapp.azure.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/bombe.westindia.cloudapp.azure.com/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/bombe.westindia.cloudapp.azure.com/chain.pem', 'utf8');  
  const credentials = {key: privateKey, cert: certificate, ca: ca};
  httpsServer = new https.createServer(credentials);
  wss = new WebSocket.Server({ server: httpsServer });
}

// create a normal websocket
httpServer = http.createServer();
ws = new WebSocket.Server({ server: httpServer });

// list of clients
let wsclients = [];
let clients = [];

const onMessage = (ws, message) => {
  let msg = JSON.parse(message);

  // msg = {
  //   type: 'new-connection',
  //   name: 'patient',
  //   id: 'unique-id'
  // }

  if (msg.type == 'new-connection') {
    wsclients.push(ws);
    clients.push(msg.id);
  // } else if (msg.type == 'offer' || )
  } else {
    let msgFor = msg.to;
    for (let i in clients) {
      if (clients[i] == msgFor) {
        let c = wsclients[i];
        if (c.readyState === c.OPEN) {
          c.send(message);
          break;
        } else {
          // TODO:
          // splice the array here
        }  
      }
    }
  }

  console.log(message);
}

const onClose = (ws) => {
  let index = wsclients.indexOf(ws);
  wsclients.splice(index, 1);
  clients.splice(index, 1);
  console.log("removed WS at index:", index);
}

// handle WSS
if (process.env.NODE_ENV == 'prod') {
  wss.on('connection', (ws) => {
    console.log('client connected');

    ws.on('message', (message) => {
      onMessage(ws, message);
    });

    ws.on('close', () => {
      onClose(ws);
    });
  });
}

// handle WS
ws.on('connection', (ws) => {
  console.log('client connected');

  ws.on('message', (message) => {
    onMessage(ws, message);
  });

  ws.on('close', () => {
    onClose(ws);
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
