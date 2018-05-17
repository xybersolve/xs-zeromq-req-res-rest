//
//  responder.js (server)
//    - responds to requesting client
//    - REP socket to tcp://*:8672
//
const responder = require('zeromq').socket('rep');
const { randomInt, getTime } = require('./helpers');
const workTime = 1000;
const port = '8672';
//const address = `tcp://*:${port}`;
const address = process.env.ZMQ_REQ_ADDRESS || `tcp://*:${port}`;
let req = {};
let res = {};

const randomWorkTime = () => {
  let workTime = randomInt(50, 250);
  console.log(`workTime: ${workTime}`);
  return workTime;
}

responder.on('message', (request) => {
  work = JSON.parse(request.toString());
  // stamp work 'recieved'
  work.recieved = getTime();
  // dispatch work
  switch(work.action) {
    case 'ping':
      work.message = 'pong'
      break;
    case 'increment':
      work.number = parseInt(work.number) + 1;
      break;
    default:
      console.error(`Error: Unknown action: ${work.action}`)
  }
  // emulate some work time
  setTimeout(() => {
    // stamp work 'completed'
    work.completed = getTime();
    responder.send(JSON.stringify(work));
  }, randomWorkTime());
});

responder.bind(address, (err) => {
  if (err) return console.error(err);
  console.log(`responder, binds on: ${address}`);
});

process.on('SIGINT', () => {
  responder.close();
});
