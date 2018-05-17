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
//const requestor = zmq.socket('req');
//const request = requestor.connect(zeromq_address);
const requestor = zmq.socket('req').connect(zeromq_address);
const pending = {};
const message = 'from express';

requestor.connect(zeromq_address);
requestor.on('message', (data) => {
  //console.log('got zeromq reply');
  process.stdout.write('server2: got zeromq reply');
  data = JSON.parse(data);
  if(! pending[data.requestId]) {
    process.stdout.write('server2: got orphaned pending response');
    //console.error('server2: got orphaned pending resesponse')
    return;
  }
  pending[data.requestId].send(data);
  delete pending[data.requestId];
})

app.get('/ping', (req, res) => {
  //console.log('sending request');
  process.stdout.write(`server2: got REST request, send zeromq request`);
  const recieved = getTime();
  const requestId = randUUID();
  pending[requestId] = res;
  const data = {
    action: 'ping',
    requestId,
    message,
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
