const zmq = require('zeromq');
console.log(`ZMQ Version: ${zmq.version}`);
const port = '8677'
//const address = `tcp://localhost:${port}`
const address = process.env.ZMQ_RES_ADDRESS || `tcp://*:${port}`;
console.log(`address: ${address}`)
