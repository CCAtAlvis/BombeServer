const express = require('express');
const router = express.Router();

let wsclients = [];

// WebSockets
router.ws('/echo/:id', (ws, req) => {
  // console.log('in here');
  // console.log(req.params.id);
  // console.log(req.url);

  // TODO:
  // proper handling of ws clients by inserting in DB
  wsclients.push(ws);

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


const initWS = (app) => {
    app.use("/ws", router);
}

module.exports = initWS;
