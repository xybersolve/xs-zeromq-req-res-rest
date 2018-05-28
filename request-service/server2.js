//
// 2nd method: make request to another microservice
//  - queue express 'response' for zmq reply. on 'message'
//  - not reusable - in-code solution - must be implmented by each service
//
const express = require('express');
const zmq = require('zeromq');
const randUUID = require('uuid/v4'); // random

const { randomInt, getTime } = require('./helpers');
//const address = `tcp://localhost:${port}`
const zeromq_port = process.env.ZMQ_PORT || 8672;
const http_port = process.env.HTTP_PORT || 8686;
//const http_host = process.env.HTTP_HOST || 'localhost';
const zeromq_address = process.env.ZMQ_RES_ADDRESS || `tcp://localhost:${zeromq_port}`;

console.log(`
  zmq address: ${zeromq_address}
  http port: ${http_port}
`)

const app = express();
const requestor = zmq.socket('req').connect(zeromq_address);
const pending = {};

// zeromq
requestor.connect(zeromq_address);
requestor.on('message', (data) => {
  data = JSON.parse(data);
  if(! pending[data.requestId]) {
    console.error('Error: got orphaned pending response');
    return;
  }
  pending[data.requestId].send(data);
  delete pending[data.requestId];
})

// REST routes
app.get('/ping', (req, res) => {
  const recieved = getTime();
  const requestId = randUUID();
  pending[requestId] = res;
  const data = {
    action: 'ping',
    requestId,
    message: 'pong',
    recieved
  };
  requestor.send(JSON.stringify(data));
})

app.get('/increment/:number', (req, res) => {
  const number = req.params.number;
  console.log('sending request');
  const recieved = getTime();
  const requestId = randUUID();
  pending[requestId] = res;
  const data = {
    action: 'increment',
    number,
    requestId,
    recieved
  };
  requestor.send(JSON.stringify(data));
})

//const server = app.listen(http_port, http_host, () => {
const server = app.listen(http_port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Request-Response Web Server, listening: http://${host}:${port}`);
})

process.on('SIGINT', () => {
  requestor.close();
})
