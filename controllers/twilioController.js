const accountSid = 'ACa79d0691ec4d56b89ebc0e1b352953c7';
const authToken = '03a9834775f12bb4fd61a93a5c138246';
const client = require('twilio')(accountSid, authToken);

const from = '+16789522140';
let to = '+918655759385';

const sendOTP = (otp, to) => {
  client.messages
  .create({
    body: `Hello there! Your OTP for I-SEE-U is ${otp}`,
    // from: 'whatsapp:+14155238886',
    // to: 'whatsapp:+15005550006'
    from: from,
    to: to
  })
  .then(message => {
    console.log(message.sid)
  });
}
// sendMessage();

module.exports = {
  sendOTP
}
