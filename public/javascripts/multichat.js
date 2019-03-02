'use strict';
//--------------------------------------------------------------------INITIALIZATION-----------------------------------------------
const wsHost = 'wss://bombe.westindia.cloudapp.azure.com:8443/ws/';
let wsChannel = 'echo/chetan';
let wsUri = wsHost + wsChannel;
const websocket = new WebSocket(wsUri);
const callButton = document.getElementById('callButton');
callButton.disabled = true;
callButton.addEventListener('click', call);
const hangupButton = document.getElementById('hangupButton');
hangupButton.disabled = true;
hangupButton.addEventListener('click', hangup);
let localVideo = document.getElementById('localVideo');

let remoteVideo1  = document.getElementById('remoteVideo1');
let remoteVideo2  = document.getElementById('remoteVideo2');
let remoteVideo3  = document.getElementById('remoteVideo3');

let localStream;
let localConn;
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
let from;
let to;
start();
//------------------------------------------------------------END OF INITIALIZATION-----------------------------------------------

//--------------------------------------------------------------HANDLING WEBSOCKET EVENTS-----------------------------------------
websocket.addEventListener('open', e => onOpen(e));
websocket.addEventListener('close', e => onClose(e));
websocket.addEventListener('error', e => onError(e));
websocket.addEventListener('message', e => onMessage(e));
function onOpen(evt) {
    console.log('CONNECTED to WS');
    let message = {
        type : 'new-connection',
        name : 'chatter',
        id : from
    }
    websocket.send(JSON.stringify(message));
    console.log('Message on connecting: ',message);
}
function onClose(evt) {
    console.log('DISCONNECTED from WS');
}
function onError(evt) {
    console.log('ERROR from WS: ' + evt.data);
}
function onMessage(evt) {
    let message = JSON.parse(evt.data);
    console.log('localConn(',message.to,') got a ',message.type,' from ',message.name,'(',message.from,')');
    if (message.type == 'offer' &&(message.name=='offerer'||message.name=='answerer')) {
        onGetOffer(message.offer, message.name);
    } else if (message.type == 'answer' &&(message.name=='offerer'||message.name=='answerer')) {
        onGetAnswer(message.answer, message.name);
    } else if (message.type == 'icecandi' &&(message.name=='offerer'||message.name=='answerer'||message.name=='ICEmessenger')) {
        onGetIceCandi(message.candidate, message.name);
    } else {

    }
}
//--------------------------------------------------------------END OF HANDLING WEBSOCKET EVENTS------------------------------------

async function start() {
    to = prompt("enter To:");
    from = prompt("enter From:");
    try {
        const stream = await navigator.mediaDevices.getUserMedia(mediaPermission);
        localVideo.srcObject = stream;
        localStream = stream;
        callButton.disabled = false;
        console.log("start() : Set localVideo src to localStream")
    } catch (e) {
        console.log('start() : getUserMedia() error: ',e.name);
    }
    try {
        localConn = new RTCPeerConnection(configuration);
        localConn.addEventListener('icecandidate', e => onIceCandidate(localConn, e));
        localConn.addEventListener('iceconnectionstatechange', e => onIceStateChange(localConn, e));
        localConn.addEventListener('track', gotRemoteStream);
        localStream.getTracks().forEach(track => localConn.addTrack(track, localStream));
        console.log('start() : Added localStream to local conn');
    } catch (e) {
        console.log(e);
    }
}

async function call() {
    try {
        const offer = await localConn.createOffer(offerOptions);
        hangupButton.disabled = false;
        console.log('call() : Offerer created offer successfully');
        await onCreateOfferSuccess(offer);
    } catch (e) {
        onCreateSessionDescriptionError(e);
    }
}

async function onCreateOfferSuccess(desc) {
    try {
        await localConn.setLocalDescription(new RTCSessionDescription(desc));
        console.log('Offerer set its localDesc to offer')
        let message = {
            type: 'offer',
            name: 'offerer',
            offer: desc,
            // id: from,
            from : from,
            to : to
        };
        websocket.send(JSON.stringify(message));
        console.log('Offerer sent the message to answerer.');
    } catch (e) {
        onSetSessionDescriptionError(e);
    }
}

async function onGetOffer(offer, name) {
    try {
        await localConn.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Answerer created answer and setRemoteDesc to offer');
    } catch (e) {
        console.log("error: ", e);
    }
    try {
        const answer = await localConn.createAnswer();
        await localConn.setLocalDescription(answer);
        console.log('Answerer setLocalDesc to answer')
        let message = {
            type: 'answer',
            name: 'answerer',
            answer: answer,
            // id: from,
            from : from,
            to : to
        };
        websocket.send(JSON.stringify(message));
    } catch (e) {
        console.log(e);
    }
};

async function onGetAnswer(answer, name) {
    try {
        await localConn.setRemoteDescription(answer);
        console.log('Offerer setRemoteDesc to answer');
    } catch (e) {
        console.log("error: ", e);
    }
};

async function onIceCandidate(pc, event) {
    try {
        let message = {
            type: 'icecandi',
            name: 'ICEmessenger',
            candidate: event.candidate,
            // id: from,
            from : from,
            to : to
        };
        websocket.send(JSON.stringify(message));
    } catch (e) {
        onAddIceCandidateError(pc, e);
    }
    console.log('localConn sent ICE-candi to other client');
}

async function onGetIceCandi(candi, name) {
    localConn.addIceCandidate(candi);
    console.log('localConn recieved ICEcandi and added it.')
}

function gotRemoteStream(e) {
    console.log('I GOT THE REMOTE STREAM!');
    if (remoteVideo1.srcObject !== e.streams[0]) {
        remoteVideo1.srcObject = e.streams[0];
        console.log('LOCALCONN received remote stream');e
    }
}

function hangup() {
    console.log('Ending call');
    localConn.close();
    localConn = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
}

function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description:`);
    console.log(error);
}

function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description:`);
    console.log(error);
}
// function getSelectedSdpSemantics() {
//   const sdpSemanticsSelect = document.querySelector('#sdpSemantics');
//   const option = sdpSemanticsSelect.options[sdpSemanticsSelect.selectedIndex];
//   return option.value === '' ? {} : {sdpSemantics: option.value};
// }
// function onSetLocalSuccess(pc) {
//   console.log(`${getName(pc)} setLocalDescription complete`);
// }
// function onSetRemoteSuccess(pc) {
//   console.log(`${getName(pc)} setRemoteDescription complete`);
// }
// function onAddIceCandidateSuccess(pc) {
//     console.log(`${getName(pc)} addIceCandidate success`);
// }
// function onAddIceCandidateError(pc, error) {
//     console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
// }
function onIceStateChange(localConn, event) {
  if (localConn) {
    console.log(`localConn ICE state: ${localConn.iceConnectionState}`);
    console.log('ICE state change event: ', event);
  }
} 