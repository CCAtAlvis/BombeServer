'use strict';
const wsHost = 'wss://bombe.westindia.cloudapp.azure.com:8443/ws/';
let wsChannel = 'echo/chetan';
let wsUri = wsHost + wsChannel;
const websocket = new WebSocket(wsUri);
// const startButton = document.getElementById('startButton');
// const callButton = document.getElementById('callButton');
// const hangupButton = document.getElementById('hangupButton');
// callButton.disabled = true;
// hangupButton.disabled = true;
// startButton.addEventListener('click', start);
// callButton.addEventListener('click', call);
// hangupButton.addEventListener('click', hangup);
// const localVideo = document.getElementById('localVideo');
const requestButton = document.getElementById('requestButton');
requestButton.addEventListener('click', createRequest);
let startTime;
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let localConn;
let pc2;
const mediaPermission = { audio: true, video: true };
const offerOptions = {
  mandatory: {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  },
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true
};
let configuration = {
  sdpSemantics: "unified-plan", 
  iceServers: [
  { urls: 'stun:stun.stunprotocol.org:3478' },
  // { urls: 'turn:localhost:9999',
  //   username: 'bombe',
  //   credential: 'bombe'
  // },
  { urls: 'turn:bturn2.xirsys.com:80?transport=udp',
    username: 'cf3f2d7e-34ee-11e9-83f7-1c77da0cc4bc',
    credential: 'cf3f2e50-34ee-11e9-82e9-78f09928b5b8' },
  ] };


async function start() {
  // console.log('Requesting local stream');
  // startButton.disabled = true;
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia(mediaPermission);
    //     // console.log('Received local stream');
    //     localVideo.srcObject = stream;
    //     localStream = stream;
    //     callButton.disabled = false;
    //   } catch (e) {
    //     alert(`getUserMedia() error: ${e.name}`);
    //   }
  try {
    localConn = new RTCPeerConnection(configuration);
    // console.log('Created local peer connection object pc1');
    localConn.addEventListener('icecandidate', e => onIceCandidate(localConn, e));
    localConn.addEventListener('iceconnectionstatechange', e => onIceStateChange(localConn, e));
    localConn.addEventListener('track', gotRemoteStream);
    // localStream.getTracks().forEach(track => localConn.addTrack(track, localStream));
    //console.log('Added local stream to local conn');
    //createRequest();
  } catch (e) {
    console.log(e);
  }
}
async function createRequest() {
    try {
        // await (getOtherPc(pc).addIceCandidate(event.candidate));
        // onAddIceCandidateSuccess(pc);
        let message = {
          type: 'request',
          name: 'client',
          //candidate: event.candidate
        };
        websocket.send(JSON.stringify(message));
        console.log('send the request to client.')
      } catch (e) {
        console.log("COULD not send request..");
      }
}


// function getSelectedSdpSemantics() {
//   const sdpSemanticsSelect = document.querySelector('#sdpSemantics');
//   const option = sdpSemanticsSelect.options[sdpSemanticsSelect.selectedIndex];
//   return option.value === '' ? {} : {sdpSemantics: option.value};
// }


// async function call () {
//   // callButton.disabled = true;
//   // hangupButton.disabled = false;
//   console.log('Starting call');
//   // startTime = window.performance.now();
//   // const videoTracks = localStream.getVideoTracks();
//   // const audioTracks = localStream.getAudioTracks();
//   // if (videoTracks.length > 0) {
//   //   console.log(`Using video device: ${videoTracks[0].label}`);
//   // }
//   // if (audioTracks.length > 0) {
//   //   console.log(`Using audio device: ${audioTracks[0].label}`);
//   // }
//   // const configuration = getSelectedSdpSemantics();
//   // console.log('RTCPeerConnection configuration:', configuration);
//   // pc2 = new RTCPeerConnection(configuration);
//   // console.log('Created remote peer connection object pc2');
//   // pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
//   // pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
//   // pc2.addEventListener('track', gotRemoteStream);
//   try {
//     const offer = await localConn.createOffer(offerOptions);
//     console.log('local conn createOffer done');
//     await onCreateOfferSuccess(offer);
//   } catch (e) {
//     onCreateSessionDescriptionError(e);
//   }
// }

function onCreateSessionDescriptionError (error) {
  console.log(`Failed to create session description:`);
  console.log(error);
}

// async function onCreateOfferSuccess (desc) {

//   try {
//     console.log(desc);
//     await localConn.setLocalDescription(new RTCSessionDescription(desc));
//     // onSetLocalSuccess(localConn);
//     let message = {
//       type: 'offer',
//       name: 'chetan',
//       offer: desc
//     };
//     websocket.send(JSON.stringify(message));
//     console.log('local conn setLocalDescription done');
//   } catch (e) {
//     onSetSessionDescriptionError(e);
//   }
// }

function onSetLocalSuccess(pc) {
  console.log(`${getName(pc)} setLocalDescription complete`);
}

function onSetRemoteSuccess(pc) {
  console.log(`${getName(pc)} setRemoteDescription complete`);
}

function onSetSessionDescriptionError(error) {
  console.log(`Failed to set session description:`);
  console.log(error);
}

function gotRemoteStream(e) {
  console.log('I GOT THE REMOTE STREAM!');
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
    console.log('set remoteVid source to remote stream');
  }
}

async function onIceCandidate(pc, event) {
  try {
    // await (getOtherPc(pc).addIceCandidate(event.candidate));
    // onAddIceCandidateSuccess(pc);
    let message = {
      type: 'icecandi',
      name: 'client',
      candidate: event.candidate
    };
    websocket.send(JSON.stringify(message));
  } catch (e) {
    onAddIceCandidateError(pc, e);
  }
  // console.log(`ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  console.log('sent ICE-candi to other patient');
}

function onAddIceCandidateSuccess(pc) {
  console.log(`${getName(pc)} addIceCandidate success`);
}

function onAddIceCandidateError(pc, error) {
  console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}

function onIceStateChange(pc, event) {
  // if (pc) {
  //   console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
  //   console.log('ICE state change event: ', event);
  // }
}

// function hangup() {
//   console.log('Ending call');
//   localConn.close();
//   localConn = null;
//   hangupButton.disabled = true;
//   callButton.disabled = false;
// }




















// HANDLING WS events
websocket.addEventListener('open', e => onOpen(e));
websocket.addEventListener('close', e => onClose(e));
websocket.addEventListener('error', e => onError(e));
websocket.addEventListener('message', e => onMessage(e));

// websocket.onopen = function (evt) {
//   onOpen(evt);
// };

// websocket.onclose = function (evt) {
//   onClose(evt);
// };

// websocket.onmessage = function (evt) {
//   onMessage(evt);
// };

// websocket.onerror = function (evt) {
//   onError(evt);
// };

function onOpen (evt) {
  console.log('CONNECTED to WS');
}

function onClose (evt) {
  console.log('DISCONNECTED from WS');
}

function onError (evt) {
  console.log('ERROR from WS: ' + evt.data);
}

function onMessage (evt) {
  // console.log('RESPONSE from WS: ' + evt.data);
  console.log('GOT msg from WS:');
  let message = JSON.parse(evt.data);
  if (message.type == 'offer') {
      console.log("Client got offer(GOOD)");
    onGetOffer(message.offer, message.name);
  } else if (message.type == 'answer') {
    console.log("Client got answer(BAD)");
    //onGetAnswer(message.answer, message.name);
  } else if (message.type == 'icecandi') {
    console.log("Client got icecandi(GOOD)");
    onGetIceCandi(message.candidate, message.name);
  } else if (message.type == 'request') {
    console.log("Client got request(BAD)");
  }
}







async function onGetOffer (offer, name) {
  try {
    await localConn.setRemoteDescription(new RTCSessionDescription(offer));
    console.log('Offer set to remote desc');
  } catch (e) {
    console.log("error: ",e);
  }
  try {
    const answer = await localConn.createAnswer();
    await localConn.setLocalDescription(answer);
    console.log('client created answer and set it to local desc');
    let message = {
      type: 'answer',
      name: 'client',
      answer: answer
    };
    websocket.send(JSON.stringify(message));
    console.log('answer sent to patient');
  } catch (e) {
    console.log(e);
  }
};

// async function onGetAnswer (answer, name) {
//   try {
//     await localConn.setRemoteDescription(answer);
//     console.log('set remote desc to answer done');
//   } catch (e) {
//     console.log("error: ",e);
//   }
// };

async function onGetIceCandi (candi, name) {
  if (candi !=null && name=='patient') {
        localConn.addIceCandidate(candi);
        console.log("got ice candidate from patient and added it.")
        //console.log('connections[',connections.length-1,'] GOT ICE-candi and added it');
    }
}
start();