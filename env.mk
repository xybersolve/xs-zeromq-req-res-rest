#
# Project Specifics
#
ORG := xybersolve
PROJECT := xs-zmq-req-res-rest

# won't work in Jenkins docker - only used for 'open'
#HOST_NAME := $(shell docker-machine active)
#HOST_IP := $(shell docker-machine ip $(HOST_NAME))
HTTP_PORT := 8080

GIT_SHORT := $(shell git log -1 --pretty=%h)
