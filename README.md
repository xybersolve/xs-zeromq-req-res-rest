# xs-zeromq-request-response-rest

> Lightweight microservice communication between an Express REST API endpoint
service and backend worker service using zeromq. ZeroMQ request is wrapped
in promise, using two methods below.

> CI/CD: `make` handles all build, tag and deployment routines and is equally 
consumed by Jenkins and/or CircleCi. CircleCi being more succinct.
Note: CircleCi is setup to only deploy on push to `release` branch.

### Two Promise Methods (reusable promise and inline):
1) `server.js` : promise based requestor-p retains `resolve` in `pending` object,
which syncs senders resolve on zeromq reply via `message` event. `requestor-p`
is reusable in other microservices.

2) `server2.js`: (inline) Express `response` is directly queued in `pending`
object and synced to on zeromq reply via `message` event. This is an in-line
solution and not reusable.

> Notes: In both models `requestID` is generated and used as key in queued
`resolve` or `response` methods. `requestID` is sent to zeromq responder
(worker) and returned as part of reply. It is then used as the key in
the `pending` queue, to fire said `response` or `resolve`.

The response-service worker employs a small random work time, to provide a
more real-world microservice scenario.

## REST calls
#### Ping: simple smoke-test
```
$ curl http://<docker-machine ip>:8082/ping

{
  "action":"request",
  "requestId":"fb2b7950-a2c2-4f28-9d19-42b5c8715cab",
  "message":"pong",
  "recieved":1526581498661,
  "completed":1526581498897
}
```

#### Increment: zeromq response worker increments integer
```
$ curl http://<docker-machine ip>:8082/increment/15
{
  "action":"increment",
  "number":16,"requestId":"2fa7469b-cc62-4b92-a568-b2eeb3056f83",
  "recieved":1526581428484,
  "completed":1526581428644
}

```
### Makefile help
```sh

archive              Archive images
build                Build requestor & responder images
clean                Clean up requestor & responder
down                 Down for Docker Compose project
increment            Call the increment REST endpoint
ping                 Call the ping REST endpoint
run                  Run REST, requestor & responder services as daemons
show                 Show the Docker Machine Host Name & IP
stop                 Hard stop of containers
up                   Run requestor & responder in live mode (view logs)

```

## [License](LICENSE.md)
