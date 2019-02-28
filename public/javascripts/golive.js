'use strict';
//-----------------------------------------------------------------INITIALIZATION------------------------------------------------------------------------
const wsHost = 'wss://bombe.westindia.cloudapp.azure.com:8443/ws/';
let wsChannel = 'echo/chetan';
let wsUri = wsHost + wsChannel;
let patID = 'Pchetan123456';
const websocket = new WebSocket(wsUri);
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
var clients = [];
const localVideo = document.getElementById('goLiveLocalVideo');
let localStream;
init();
//-----------------------------------------------------------------END OF INITIALIZATION------------------------------------------------------------------------

//-----------------------------------------------------------------HANDLING WEBSOCKET EVENTS--------------------------------------------------------------------
websocket.addEventListener('open', e => onOpen(e));
websocket.addEventListener('close', e => onClose(e));
websocket.addEventListener('error', e => onError(e));
websocket.addEventListener('message', e => onMessage(e));
function onOpen(evt) {
    console.log('CONNECTED to WS');
    let msg = {
        type: 'new-connection',
        name: 'patient',
        id: patID
    };
    websocket.send(JSON.stringify(msg));
}
function onClose(evt) {
    console.log('DISCONNECTED from WS');
}
function onError(evt) {
    console.log('ERROR from WS: ' + evt.data);
}
function onMessage(evt) {
    let message = JSON.parse(evt.data);
    console.log('Patient got a ',message.type,' from ',message.name);
    if (message.type == 'offer' && message.name == 'client') {
        //onGetOffer(message.offer, message.name); //patient ignores offers from clients and patients
    } else if (message.type == 'answer' && message.name == 'client') {
        onGetAnswer(message.answer, message.name,message.from);
    } else if (message.type == 'icecandi' && message.name == 'client') {
        onGetIceCandi(message.candidate, message.name);
    } else if (message.type == 'request' && message.name == 'client') {
        onRequest(message.from);
    } else {

    }
}
//-----------------------------------------------------------------END OF HANDLING WEBSOCKET EVENTS--------------------------------------------------------------------

async function init() { /* Adds local stream from camera and mic to LOCALVIDEO DIV*/
    try {
        const stream = await navigator.mediaDevices.getUserMedia(mediaPermission);
        if (localVideo.srcObject == null) {
            localVideo.srcObject = stream;
            localStream = stream;
            console.log('init() - Added local stream to LOCALVIDEO div');
        }
    } catch (e) {
        alert(`init() - getUserMedia() error: ${e.name}`);
    } 
}

async function onRequest(clientID) { /* creates a variable localCOnn,adds it to array,creates an offer*/
    console.log('.'); console.log('.'); console.log('.'); console.log('.'); console.log('.'); console.log('.'); console.log('.');
    try {
        let localConn;
        clients.push(clientID);
        let index = clients.reverse().indexOf(clientID);;
        try {
            //console.log('onRequest() with connections[',connections.length-1,']');
            localConn = new RTCPeerConnection(configuration);
            localConn.addEventListener('icecandidate', e => onIceCandidate(e,clientID));
            //(connections[connections.length - 1]).addEventListener('iceconnectionstatechange', e => onIceStateChange((connections[connections.length - 1]), e));
            localStream.getTracks().forEach(track => localConn.addTrack(track, localStream));
            //console.log('onRequest() : Added local stream to connections[',connections.length-1,']');
        } catch (e) {
            //console.log("onRequest() : Error in onRequest() : ",e);
        }
        //console.log('onRequest() with connections[',connections.length-1,']');
        connections.splice(index,0,localConn);
        // connections.push(localConn);
        console.log('onRequest() with connections[',index,']');
        let offer = await (connections[index]).createOffer(offerOptions);
        await onCreateOfferSuccess(offer,clientID);
    } catch (e) {
        onCreateSessionDescriptionError(e);
    }
}

async function onCreateOfferSuccess(desc,clientID) {
    try {
        let index = clients.reverse().indexOf(clientID);
        console.log('connections[',index,'] successfully created an offer.');
        await (connections[index]).setLocalDescription(new RTCSessionDescription(desc));
        console.log('connections[',index,'] local desc was set to offer');
        let message = {
            type: 'offer',
            name: 'patient',
            offer: desc,
            to : clientID,
            from : patID
        };
        websocket.send(JSON.stringify(message));
        console.log('connections[',index,'] sent the offer to requesting person.');
    } catch (e) {
        onSetSessionDescriptionError(e);
    }
}

async function onGetAnswer(answer, name,clientID) {
    try {
        let index = clients.reverse().indexOf(clientID);
        console.log('connections[',index,'] set its remote desc to answer');
        await (connections[index]).setRemoteDescription(answer);
    } catch (e) {
        console.log("error: ", e);
    }
};

async function onIceCandidate(event,clientID) {
    try {
        let message = {
            type: 'icecandi',
            name: 'patient',
            candidate: event.candidate,
            to: clientID,
            from : patID
        };
        websocket.send(JSON.stringify(message));
    } catch (e) {
        onAddIceCandidateError(pc, e);
    }
    console.log('connections[',connections.length-1,'] sent ICE-candi to other person');
}

async function onGetIceCandi(candi, name) {
    if (candi !=null && name=='client') {
        (connections[connections.length - 1]).addIceCandidate(candi);
        console.log('connections[',connections.length-1,'] GOT ICE-candi and added it');
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

// async function start() { /* defines localconn,adds events and tracks to it*/ 
//     try {
//         console.log('onRequest() with connections[',connections.length-1,']');
//         (connections[connections.length - 1]) = new RTCPeerConnection(configuration);
//         (connections[connections.length - 1]).addEventListener('icecandidate', e => onIceCandidate((connections[connections.length - 1]), e));
//         (connections[connections.length - 1]).addEventListener('iceconnectionstatechange', e => onIceStateChange((connections[connections.length - 1]), e));
//         localStream.getTracks().forEach(track => (connections[connections.length - 1]).addTrack(track, localStream));
//         console.log('onRequest() : Added local stream to connections[',connections.length-1,']');
//     } catch (e) {
//         console.log("onRequest() : Error in onRequest() : ",e);
//     }
// }
// function onIceStateChange(pc, event) {
//     // if (pc) {
//     //   console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
//     //   console.log('ICE state change event: ', event);
//     // }
// }
// function getSelectedSdpSemantics() {
//   const sdpSemanticsSelect = document.querySelector('#sdpSemantics');
//   const option = sdpSemanticsSelect.options[sdpSemanticsSelect.selectedIndex];
//   return option.value === '' ? {} : {sdpSemantics: option.value};
// }
// function onSetLocalSuccess(pc) {
//     console.log(`${getName(pc)} setLocalDescription complete`);
// }
// function onSetRemoteSuccess(pc) {
//     console.log(`${getName(pc)} setRemoteDescription complete`);
// }
// function onAddIceCandidateSuccess(pc) {
//     console.log(`${getName(pc)} addIceCandidate success`);
// }
// function onAddIceCandidateError(pc, error) {
//     console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
// }
// function gotRemoteStream(e) {
//   console.log('HACKER MAN, M In');
//   if (remoteVideo.srcObject !== e.streams[0]) {
//     remoteVideo.srcObject = e.streams[0];
//     console.log('local conn received remote stream');
//   }
// }
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
// function hangup() {
//   console.log('Ending call');
//   localConn.close();
//   localConn = null;
//   hangupButton.disabled = true;
//   callButton.disabled = false;
// }