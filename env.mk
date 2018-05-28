PROJECT := zeromq-http-req-res
#IMAGE := zeromq-http-req-res

HOST_NAME := $(shell docker-machine active)
HOST_IP := $(shell docker-machine ip $(HOST_NAME))
HTTP_PORT := 8080

GIT_SHORT := $(shell git log -1 --pretty=%h)
