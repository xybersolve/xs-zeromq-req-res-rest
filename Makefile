#
# TODO: tests
#
.PHONY: deploy build up run tag login push stop down clean  delete ssh archive show ping increment help

include env.mk
include info.mk
include check.mk

user := ${DOCKER_USER}
pass := ${DOCKER_PASS}

# for local testing
#HOST_IP := 127.0.0.1
#HTTP_PORT := 8686
VERSION := $(GIT_SHORT)

# the complete build to push cycle
deploy: clean build tag login push

build: ## Build images: make build ver=1.2.1
	${INFO} "Building $(PROJECT) image..."
	@docker-compose -p $(PROJECT) build

up: ## Run requestor & responder in live mode
	${INFO} "Starting $(PROJECT), with 'up'..."
	@docker-compose -p $(PROJECT) up

run: ## Run requestor & responder in daemon mode
	${INFO} "Running $(PROJECT), with 'up -d', in daemon mode..."
	@docker-compose -p $(PROJECT) up -d

stop: ## Low level clean-up, stop containers
	${INFO} "Hard stop of $(PROJECT) containers..."
	@docker stop zmq-http-res
	@docker stop zmq-http-req

clean: ## Low level clean-up - delete images
	${INFO} "Hard cleanup of $(PROJECT) image..."
	@docker image rmi zmq-http-res:latest || true
	@docker image rmi zmq-http-req:latest || true

tag:
	${INFO} "Tag images for $(PROJECT)..."
	@docker tag zmq-http-res $(ORG)/zmq-http-res:latest
	@docker tag zmq-http-req $(ORG)/zmq-http-req:latest

login: ## Login to docker hub
	${INFO} "Logging into DockerHub..."
	# from terminal or Jenkins Credentials
	@docker login -u $(user) -p $(pass)

push: login ## Push to DockerHub, requires prior login
	${INFO} "Push to DockerHub"
	@docker push $(ORG)/zmq-http-res:latest
	@docker push $(ORG)/zmq-http-req:latest

down: ## Clean up requestor & server
	${INFO} "Taking 'down' $(PROJECT)..."
	@docker-compose -p $(PROJECT) down

show: ## Show docker machine host name, ip & http port
	@echo $(HOST_NAME):$(HOST_IP):$(HTTP_PORT)

ping: ## Call ping REST endpoint
	${INFO} "Pinging microservice endpoint..."
	@curl http://$(HOST_IP):$(HTTP_PORT)/ping

increment: ## Call increment REST endpoint
	${INFO} "Calling microservice endpoint: /increment/15..."
	@curl http://$(HOST_IP):$(HTTP_PORT)/increment/15
