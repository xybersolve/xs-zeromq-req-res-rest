//
// requestor.js (client)
//   - calls requestor-p promise base requestor for zeromq
//
const request = require('./requestor-p');
const { randomInt, getTime } = require('./helpers');
//const address = `tcp://localhost:${port}`
const port = '8672';
const address = process.env.ZMQ_RES_ADDRESS || `tcp://localhost:${port}`;

let data = {
  message: 'some data to work on',
}
// socket to talk to server
const nextRequest = () => {
  setTimeout(() => {
    makeRequest();
    nextRequest();
  }, randomInt(500, 1250))
}

makeRequest = () => {
  request.send({
    data,
    address,
    epoch: getTime(),
  })
    .then((reply) => {
      console.dir(JSON.parse(reply))
    })
    .catch(console.error)

}

nextRequest();
