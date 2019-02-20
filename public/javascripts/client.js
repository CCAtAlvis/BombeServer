let wsUri = 'ws://bombe.herokuapp.com:8000/ws/echo/chetan';
let output;
const websocket = new WebSocket(wsUri);
const constraints = { audio: true, video: true };
const SDPmediaConstraints = {
  mandatory: {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  },
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true
};
let configuration = { iceServers: [
  { urls: 'stun:stun.stunprotocol.org:3478' },
  { urls: 'turn:localhost:9999',
    username: 'bombe',
    credential: 'bombe'
  },
  { urls: 'turn:bturn2.xirsys.com:80?transport=udp',
    username: 'cf3f2d7e-34ee-11e9-83f7-1c77da0cc4bc',
    credential: 'cf3f2e50-34ee-11e9-82e9-78f09928b5b8' },
  ] };
let localConnection = new RTCPeerConnection(configuration);

// localConnection.onicecandidate = (event) => {
//     // console.log(event);
//     console.log(event.candidate);
// };

// $(document).ready(function () {
//   $.ajax({
//     url: 'https://global.xirsys.net/_turn/I-SEE-U/',
//     type: 'PUT',
//     async: false,
//     headers: {
//       'Authorization': 'Basic ' + btoa('bombe:a2041642-34eb-11e9-ac14-0242ac110004')
//     },
//     success: function (res) {
//       console.log(res);
//       console.log('ICE List: ' + res.v.iceServers);
//       configuration.iceServers = res.v.iceServers;
//       localConnection = new RTCPeerConnection(configuration);
//     }
//   });
// });

const createOffer = () => {
  localConnection.createOffer(SDPmediaConstraints)
    .then(offer => {
      let message = {
        type: 'offer',
        user: 'chetan',
        offer: offer
      };
      console.log(message);
      websocket.send(JSON.stringify(message));
      localConnection.setLocalDescription(offer);
    })
    .catch(err => {
      console.log(err);
    });
};

const onOffer = (offer, name) => {
  connectedUser = name;
  localConnection.setRemoteDescription(new RTCSessionDescription(offer));

  localConnection.createAnswer()
    .then((answer) => {
      localConnection.setLocalDescription(answer);
      localConnection.setRemoteDescription(offer);
      let message = {
        type: 'answer',
        user: 'chinmay',
        answer: answer
      };
      console.log(message);
      websocket.send(JSON.stringify(message));
      // websockets code here
    }).catch((error) => {
      alert('oopsieee...Websocket did an oopsieee');
    });
};

const onAnswer = (answer, name) => {
  connectedUser = name;
  localConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

// once remote track media arrives, show it in remote video element
// localConnection.ontrack = (event) => {
//     // don't set srcObject again if it is already set.
//     if (remoteView.srcObject) return;
//     remoteView.srcObject = event.streams[0];
// };

// call start() to initiate
async function start () {
  try {
    // get local stream, show it in self-view and add it to be sent
    const stream =
        await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) =>
      localConnection.addTrack(track, stream));
    selfView.srcObject = stream;
  } catch (err) {
    console.error(err);
  }
}

// signaling.onmessage = async ({desc, candidate}) => {
//   try {
//     if (desc) {
//       // if we get an offer, we need to reply with an answer
//       if (desc.type === 'offer') {
//         await pc.setRemoteDescription(desc);
//         const stream =
//           await navigator.mediaDevices.getUserMedia(constraints);
//         stream.getTracks().forEach((track) =>
//           pc.addTrack(track, stream));
//         await pc.setLocalDescription(await pc.createAnswer());
//         signaling.send({desc: pc.localDescription});
//       } else if (desc.type === 'answer') {
//         await pc.setRemoteDescription(desc);
//       } else {
//         console.log('Unsupported SDP type.');
//       }
//     } else if (candidate) {
//       await pc.addIceCandidate(candidate);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };

function init () {
  output = document.getElementById('output');
  testWebSocket();
}

function testWebSocket () {
  websocket.onopen = function (evt) {
    onOpen(evt);
  };

  websocket.onclose = function (evt) {
    onClose(evt);
  };

  websocket.onmessage = function (evt) {
    onMessage(evt);
  };

  websocket.onerror = function (evt) {
    onError(evt);
  };
}

function onOpen (evt) {
  writeToScreen('CONNECTED');
  doSend('THE MESSAGE');
}

function onClose (evt) {
  writeToScreen('DISCONNECTED');
}

function onMessage (evt) {
  writeToScreen('<span style = "color: blue;">RESPONSE: ' +
    evt.data + '</span>');
  message = JSON.parse(evt.data);
  if (message.type == 'offer') {
    onOffer(message.offer, message.name);
  } else if (message.type == 'answer') {
    onAnswer(message.answer, message.name);
  } else {

  }
  // websocket.close();
}

function onError (evt) {
  writeToScreen('<span style = "color: red;">ERROR:</span> ' +
    evt.data);
}

function doSend (message) {
  writeToScreen('SENT: ' + message);
  websocket.send(message);
}

function writeToScreen (message) {
  var pre = document.createElement('p');
  pre.style.wordWrap = 'break-word';
  pre.innerHTML = message;
  output.appendChild(pre);
}
window.addEventListener('load', init, false);
