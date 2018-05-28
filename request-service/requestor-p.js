//
// requestor-p.js (client)
//   - promise based request client for zeromq
//   - REQ socket to tcp://localhost:8672
//
const zmq = require('zeromq')
const randUUID = require('uuid/v4') // random
const connectionString = (address) => `tcp://${address}`
let pending = {}

const send = (options) => {
  return new Promise((resolve, reject) => {
    const uuid = randUUID()
    const { data, address } = options;
    data.uuid = uuid;
    // promise queue
    pending[uuid] = {
      resolve,
      reject
    }

    try {
      const requestor = zmq.socket('req');
      const req = requestor.connect(address);
      req.send(JSON.stringify(data));
      req.on('message', (reply) => {
        // req.close();
        // parse to object to render 'uuid'
        const received = JSON.parse(reply.toString());
        if(! pending[received.uuid]) {
          console.error('No pending promise resolve in queue')
        } else {
          pending[received.uuid].resolve(JSON.stringify(received));
        }
      })
    } catch(err) {
      reject(err)
    };
  })
}


module.exports = {
  send
}
