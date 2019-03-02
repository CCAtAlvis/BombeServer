'use strict';
//-----------------------------------------------------------------INITIALIZATION------------------------------------------------------------------------
const wsHost = 'wss://bombe.westindia.cloudapp.azure.com:8443/ws/';
let wsChannel = 'echo/chetan';
let patID = 'Pchetan123456';
//let patID = 'sexychetan';
let clientID = 'c1234567890';
//let clientID = 'c1234';
let wsUri = wsHost + wsChannel;
let websocket = new WebSocket(wsUri);
let localConn;
// const requestButton = document.getElementById('requestButton');
// requestButton.addEventListener('click', createRequest);
const remoteVideo = document.getElementById('viewLiveRemoteVideo');
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
  init();
//-----------------------------------------------------------------END OF INITIALIZATION------------------------------------------------------------------------

//--------------------------------------------------------------------------------------HANDLING WS events--------------------
websocket.addEventListener('open', e => onOpen(e));
websocket.addEventListener('close', e => onClose(e));
websocket.addEventListener('error', e => onError(e));
websocket.addEventListener('message', e => onMessage(e));

function onOpen (evt) {
  console.log('CONNECTED to WS');
  let message = {
    type: 'new-connection',
    name: 'client',
    id: clientID
  }
  console.log('CONNECTED to WS: msg: ',message);
  websocket.send(JSON.stringify(message));
  createRequest();
}

function onClose (evt) {
  console.log('DISCONNECTED from WS');
}

function onError (evt) {
  console.log('ERROR from WS: ' + evt.data);
}

function onMessage (evt) {
  // console.log('RESPONSE from WS: ' + evt.data);
  let message = JSON.parse(evt.data);
  console.log('Client got a ',message.type,' from ',message.name);
  if (message.type == 'offer' && message.name == 'patient') {
      //console.log("Client got offer(GOOD)");
      onGetOffer(message.offer, message.name);
  } else if (message.type == 'offer' && message.name == 'client') {
    console.log('^^^ BAD');
  } else if (message.type == 'answer' && (message.name == 'patient'|| message.name == 'client')) {
    console.log('^^^ BAD');
  } else if (message.type == 'icecandi' && message.name == 'patient') {
    //console.log("Client got icecandi(GOOD)");
    onGetIceCandi(message.candidate, message.name);
  } else if (message.type == 'icecandi' && message.name == 'client') {
    console.log('^^^ BAD');
  } else if (message.type == 'request' && (message.name == 'patient'|| message.name == 'client')) {
    console.log("^^^ BAD");
  } else {
    console.log('else wala ^^^ BAD   U MISSED SOMETHING');
  }
}
//--------------------------------------------------------------------------------------HANDLING WS events--------------------

async function init() {
  try {
    localConn = new RTCPeerConnection(configuration);
    localConn.addEventListener('icecandidate', e => onIceCandidate(localConn, e));
    localConn.addEventListener('iceconnectionstatechange', e => onIceStateChange(localConn, e));
    localConn.addEventListener('track', gotRemoteStream);
    console.log('init() : created localConn with all eventListeners')
  } catch (e) {
    console.log('init() : error - ',e);
  }
  //setTimeout(createRequest,1000);
}

async function createRequest() {
    try {
        // 0	CONNECTING	Socket has been created. The connection is not yet open.
        // 1	OPEN	      The connection is open and ready to communicate.
        // 2	CLOSING	    The connection is in the process of closing.
        // 3	CLOSED	    The connection is closed or couldn't be opened.
        if (websocket.readyState == 2 || websocket.readyState == 3){
          console.log('ws closed,must be reopened')
        }
        let message = {
          type: 'request',
          name: 'client',
          to: patID,
          from: clientID
        };
        websocket.send(JSON.stringify(message));
        console.log('createRequest() : Sent the request to all. msg:',message)
      } catch (e) {
        console.log("COULD not send request..");
      }
}

async function onGetOffer (offer, name) {
  try {
    await localConn.setRemoteDescription(new RTCSessionDescription(offer));
    console.log('onGetOffer() : Offer set to remote desc');
  } catch (e) {
    console.log("onGetOffer() : error: ",e);
  }
  try {
    const answer = await localConn.createAnswer();
    await localConn.setLocalDescription(answer);
    console.log('client created answer and set it to local desc');
    let message = {
      type: 'answer',
      name: 'client',
      answer: answer,
      to : patID,
      from : clientID
    };
    websocket.send(JSON.stringify(message));
    console.log('answer sent to all');
    //websocket.close();
  } catch (e) {
    console.log(e);
  }
};

async function onIceCandidate(pc, event) {
  try {
    let message = {
      type: 'icecandi',
      name: 'client',
      candidate: event.candidate,
      to : patID,
      from: clientID
    };
    websocket.send(JSON.stringify(message));
  } catch (e) {
    onAddIceCandidateError(pc, e);
  }
  console.log('sent ICE-candi to other patient');
}

async function onGetIceCandi (candi, name) {
  // if (candi !=null && name=='patient') {
    if (name=='patient') {
        localConn.addIceCandidate(candi);
        console.log("got ice candidate from patient and added it.")
    }
    if (candi == null) {
      websocket.close();
    }
}

function gotRemoteStream(e) {
  console.log('I GOT THE REMOTE STREAM!');
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
    console.log('LOCALCONN set remoteVid source to remote stream');
  }
}

function onCreateSessionDescriptionError (error) {
  console.log(`Failed to create session description:`);
  console.log(error);
}
function onIceStateChange(localConn, event) {
  if (localConn) {
    console.log(`localConn ICE state: ${localConn.iceConnectionState}`);
    console.log('ICE state change event: ', event);
  }
}
// function hangup() {
//   console.log('Ending call');
//   localConn.close();
//   localConn = null;
//   hangupButton.disabled = true;
//   callButton.disabled = false;
// }
// async function onGetAnswer (answer, name) {
//   try {
//     await localConn.setRemoteDescription(answer);
//     console.log('set remote desc to answer done');
//   } catch (e) {
//     console.log("error: ",e);
//   }
// };
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
// const videoTracks = localStream.getVideoTracks();
// const audioTracks = localStream.getAudioTracks();
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
// function onSetLocalSuccess(pc) {
//   console.log(`${getName(pc)} setLocalDescription complete`);
// }
// function onSetRemoteSuccess(pc) {
//   console.log(`${getName(pc)} setRemoteDescription complete`);
// }
// function onSetSessionDescriptionError(error) {
//   console.log(`Failed to set session description:`);
//   console.log(error);
// }
// function onAddIceCandidateSuccess(pc) {
//   console.log(`${getName(pc)} addIceCandidate success`);
// }
// function onAddIceCandidateError(pc, error) {
//   console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
// }