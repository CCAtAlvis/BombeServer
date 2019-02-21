const constraints = {audio: true, video: true};
//constraints for 2 way comm. We need both audio and video
const SDPmediaConstraints = {
    mandatory: {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
    },
    'offerToReceiveAudio': true,
    'offerToReceiveVideo': true
};
//SDPmediaConstraints are Session Description Protocol which will be used for 2 way comm hence again both video and audio.
const constraintsVideo = window.constraints = {
    audio: false,
    video: true
};
//constraintsVideo are constraints for self video stream. Hence no audio,only video.
let wsUri = 'ws://localhost:8000/ws/echo/chetan';
//Web Sockets Uniform Resource Identifier: both will be same for 2 ppl who want to video chat
let output;
//to show the output of websockets on screen
let websocket = new WebSocket(wsUri);
//init ws with given wsUri
let configuration = {iceServers: [{urls: "stun:stun.stunprotocol.org:3478"}]};
//initial config which contains iceServers which will be used to create RTCPeerConnection
let localConnection = new RTCPeerConnection(configuration);
//creating a client side conn and passing them iceServers in config.


//below code is to show self stream
function handleSuccess (stream) {
    console.log('handleSuccess()');
    const video = document.querySelector('video');
    //video space in HTML file to show video
    const videoTracks = stream.getVideoTracks();
    //stream contains track with no audio only video.
    console.log('Got stream with constraints:', constraintsVideo);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; 
    //we set the obtained stream to window.stream to make variables accessible to browser console
    video.srcObject = stream;
    //setting the source of video space in HTMl to stream
    stream.onended = function (e) {
        console.log('Ended', e);
    };
}
function handleError (error) {
    console.log('handleError()');
    if (error.name === 'ConstraintNotSatisfiedError') {
        let v = constraintsVideo.video;
        errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
}
function errorMsg (msg, error) {
    console.log('errorMsg()');
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}
async function init () {
    console.log('initselfStream()');
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraintsVideo);
        handleSuccess(stream);
    } catch (e) {
        handleError(e);
    }
}
init();
//end of self stream


//bwlow is the code for STUN AND TRUN SERVERS
$( document ).ready( function () {
    console.log('document.readyFunction() for stun and trun servers')
    $.ajax ({
        url: "https://global.xirsys.net/_turn/I-SEE-U/",
        type: "PUT",
        async: false,
        headers: {
            "Authorization": "Basic " + btoa("bombe:a2041642-34eb-11e9-ac14-0242ac110004")
        },
        success: function (res){
            console.log(res)
            console.log("ICE List: "+res.v.iceServers);
            configuration.iceServers = res.v.iceServers;
            localConnection = new RTCPeerConnection(configuration);
        }
    });
})
const createOffer = () => {
    console.log('createOffer()');
    localConnection.createOffer(SDPmediaConstraints)
    .then(offer => {
    let message = {
        type : "offer",
        user : "chetan",
        offer : offer
    }
    console.log("created offer",message);
    websocket.send(JSON.stringify(message));
    localConnection.setLocalDescription(offer);
    })
    .catch(err => {
    console.log(err);
    });
}
const onOffer = (offer, name) => {
    console.log('onOffer()');
    //connectedUser = name;
    localConnection.setRemoteDescription(new RTCSessionDescription(offer)); 

    localConnection.createAnswer()
    .then((answer) => {
    localConnection.setLocalDescription(answer);
    localConnection.setRemoteDescription(offer);
    let message = {
        type : "answer",
        user : "chinmay",
        answer : answer
    }
    console.log("Answer created: ",message);
    websocket.send(JSON.stringify(message));
    // websockets code here

    }).catch((error) => {
    alert("oopsieee...stun and trun did an oopsieee");
    });
}
const onAnswer = (answer, name) => {
    console.log('onAnswer()');
    //connectedUser = name;
    localConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("answer recieved: ",answer)
}
//below function has not yet been completely implemented
/*
async function start() {
    console.log('start()');
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
*/
//end of STUN AND TURN SERVERS


//below is the code for web sockets
function initWS() {
    console.log('initWS()');
    output = document.getElementById("output");
    testWebSocket();
}
initWS();

function testWebSocket() {
    console.log('testWebSocket()');
    websocket.onopen = function(evt) {
    onOpen(evt)
    };

    websocket.onclose = function(evt) {
    onClose(evt)
    };

    websocket.onmessage = function(evt) {
    onMessage(evt)
    };

    websocket.onerror = function(evt) {
    onError(evt)
    };
}

function onOpen(evt) {
    console.log('onOpen() CONNECTED');
    //writeToScreen("CONNECTED");
    doSend("THE MESSAGE");
}

function onClose(evt) {
    console.log('onClose() DISCONNECTED')
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    //writeToScreen('<span style = "color: blue;">RESPONSE: ' + 
    //evt.data+'</span>');
    message = JSON.parse(evt.data);
    console.log('onMessage() msg recieved: ', message);
    if (message.type == "offer") {
    onOffer(message.offer,message.name);
    } else if(message.type == "answer") {
    onAnswer(message.answer,message.name);
    } else {
    
    }
    // websocket.close();
}

function onError(evt) {
    console.log('onError()');
    writeToScreen('<span style = "color: red;">ERROR:</span> '
    + evt.data);
}

function doSend(message) {
    console.log('doSend() msg sent: ',message);
    //writeToScreen("SENT: " + message); 
    websocket.send(message);
}

function writeToScreen(message) {
    console.log('writeToScreen()');
    var pre = document.createElement("p"); 
    pre.style.wordWrap = "break-word"; 
    pre.innerHTML = message; 
    output.appendChild(pre);
}
window.addEventListener("load", init, false);
//end of web sockets

