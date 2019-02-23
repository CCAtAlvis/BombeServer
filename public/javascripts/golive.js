'use strict';
const wsHost = 'wss://bombe.westindia.cloudapp.azure.com:8443/ws/';
let wsChannel = 'echo/chetan';
let wsUri = wsHost + wsChannel;
const websocket = new WebSocket(wsUri);
// const startButton = document.getElementById('startButton');
//const callButton = document.getElementById('callButton');
//const hangupButton = document.getElementById('hangupButton');
// callButton.disabled = true;
// hangupButton.disabled = true;
// startButton.addEventListener('click', start);
// callButton.addEventListener('click', call);
// hangupButton.addEventListener('click', hangup);
//const remoteVideo = document.getElementById('remoteVideo');
// let pc2;
let startTime;
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
        {
            urls: 'turn:bturn2.xirsys.com:80?transport=udp',
            username: 'cf3f2d7e-34ee-11e9-83f7-1c77da0cc4bc',
            credential: 'cf3f2e50-34ee-11e9-82e9-78f09928b5b8'
        },
    ]
};
var connections = [];
// let localConn;
const localVideo = document.getElementById('localVideo');
let localStream;


async function start() {
    try {
        console.log('start() with connections[',connections.length-1,']');
        connections[connections.length - 1] = new RTCPeerConnection(configuration);
        // console.log('Created local peer connection object pc1');
        (connections[connections.length - 1]).addEventListener('icecandidate', e => onIceCandidate(connections[connections.length - 1], e));
        (connections[connections.length - 1]).addEventListener('iceconnectionstatechange', e => onIceStateChange(connections[connections.length - 1], e));
        //localConn.addEventListener('track', gotRemoteStream);
        if(connections.length ==1) {
            localStream.getTracks().forEach(track => (connections[connections.length - 1]).addTrack(track, localStream));
        }
        console.log('Added local stream to local connection: connections[',connections.length-1,']');
    } catch (e) {
        console.log("Error in start() : ",e);
    }
}

// function getSelectedSdpSemantics() {
//   const sdpSemanticsSelect = document.querySelector('#sdpSemantics');
//   const option = sdpSemanticsSelect.options[sdpSemanticsSelect.selectedIndex];
//   return option.value === '' ? {} : {sdpSemantics: option.value};
// }


async function call() {
    //callButton.disabled = true;
    //hangupButton.disabled = false;
    // startTime = window.performance.now();
    // const videoTracks = localStream.getVideoTracks();
    // const audioTracks = localStream.getAudioTracks();
    // if (videoTracks.length > 0) {
    //   console.log(`Using video device: ${videoTracks[0].label}`);
    // }
    // if (audioTracks.length > 0) {
    //   console.log(`Using audio device: ${audioTracks[0].label}`);
    // }
    // const configuration = getSelectedSdpSemantics();
    // console.log('RTCPeerConnection configuration:', configuration);
    // pc2 = new RTCPeerConnection(configuration);
    // console.log('Created remote peer connection object pc2');
    // pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
    // pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
    // pc2.addEventListener('track', gotRemoteStream);
    try {
        let localConn;
        connections.push(localConn);
        start();
        console.log('call() with connections[',connections.length-1,']');
        const offer = await (connections[connections.length - 1]).createOffer(offerOptions);
        console.log('connections[',connections.length-1,'] created an offer.');
        await onCreateOfferSuccess(offer);
    } catch (e) {
        onCreateSessionDescriptionError(e);
    }
}


async function onCreateOfferSuccess(desc) {
    try {
        console.log('connections[',connections.length-1,'] successfully created an offer.');
        //console.log("offer: ",desc);
        await (connections[connections.length - 1]).setLocalDescription(new RTCSessionDescription(desc));
        console.log('connections[',connections.length-1,'] local desc was set to offer');
        // onSetLocalSuccess(localConn);
        let message = {
            type: 'offer',
            name: 'patient',
            offer: desc
        };
        websocket.send(JSON.stringify(message));
        console.log('connections[',connections.length-1,'] sent the offer to requesting client');
    } catch (e) {
        onSetSessionDescriptionError(e);
    }
}


function onCreateSessionDescriptionError(error) {
    console.log('connections[',connections.length-1,'] Failed to create session description:');
    console.log(error);
}
function onSetSessionDescriptionError(error) {
    console.log('connections[',connections.length-1,'] Failed to set session description:');
    console.log(error);
}
function onSetLocalSuccess(pc) {
    console.log(`${getName(pc)} setLocalDescription complete`);
}
function onSetRemoteSuccess(pc) {
    console.log(`${getName(pc)} setRemoteDescription complete`);
}
function onAddIceCandidateSuccess(pc) {
    console.log(`${getName(pc)} addIceCandidate success`);
}
function onAddIceCandidateError(pc, error) {
    console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}

// function gotRemoteStream(e) {
//   console.log('HACKER MAN, M In');
//   if (remoteVideo.srcObject !== e.streams[0]) {
//     remoteVideo.srcObject = e.streams[0];
//     console.log('local conn received remote stream');
//   }
// }


async function onIceCandidate(pc, event) {
    // TODO
    // send all ice candidates to other client via web sockets
    try {
        // await (getOtherPc(pc).addIceCandidate(event.candidate));
        // onAddIceCandidateSuccess(pc);
        let message = {
            type: 'icecandi',
            name: 'patient',
            candidate: event.candidate
        };
        websocket.send(JSON.stringify(message));
    } catch (e) {
        onAddIceCandidateError(pc, e);
    }
    // console.log(`ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    console.log('connections[',connections.length-1,'] sent ICE-candi to other client');
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

function onOpen(evt) {
    console.log('CONNECTED to WS');
}
function onClose(evt) {
    console.log('DISCONNECTED from WS');
}
function onError(evt) {
    console.log('ERROR from WS: ' + evt.data);
}
function onMessage(evt) {
    // console.log('RESPONSE from WS: ' + evt.data);
    console.log('GOT message from WS: ');
    let message = JSON.parse(evt.data);
    if (message.type == 'offer') {
        //onGetOffer(message.offer, message.name);
    } else if (message.type == 'answer') {
        onGetAnswer(message.answer, message.name);
    } else if (message.type == 'icecandi') {
        onGetIceCandi(message.candidate, message.name);
    } else if (message.type == 'request') {
        call();
    } else {

    }
}

// async function onGetOffer (offer, name) {
//   try {
//     await localConn.setRemoteDescription(new RTCSessionDescription(offer));
//     console.log('set remote desc to offer done');
//   } catch (e) {
//     console.log("error: ",e);
//   }

//   try {
//     const answer = await localConn.createAnswer();
//     await localConn.setLocalDescription(answer);
//     let message = {
//       type: 'answer',
//       user: 'chinmay',
//       answer: answer
//     };
//     console.log('create answer and set local desc to answer done');
//     websocket.send(JSON.stringify(message));
//   } catch (e) {
//     console.log(e);
//   }
// };

async function onGetAnswer(answer, name) {
    try {
        await (connections[connections.length - 1]).setRemoteDescription(answer);
        console.log('connections[',connections.length-1,'] set its remote desc to answer');
    } catch (e) {
        console.log("error: ", e);
    }
};

async function onGetIceCandi(candi, name) {
    if (candi !=null && name=='client') {
        (connections[connections.length - 1]).addIceCandidate(candi);
        console.log('connections[',connections.length-1,'] GOT ICE-candi and added it');
    }
}
async function init() {
    // console.log('Requesting local stream');
    // startButton.disabled = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia(mediaPermission);
        // console.log('Received local stream');
        if (localVideo.srcObject == null) {
            localVideo.srcObject = stream;
            localStream = stream;
        }
        //callButton.disabled = false;
    } catch (e) {
        alert(`getUserMedia() error: ${e.name}`);
    }
    // let localConn;
    // connections.push(localConn);
    // start();    
}
init();