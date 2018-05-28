#
# TODO: tests
#
.PHONY: build up run stop down clean  delete ssh archive show ping increment help

include env.mk
include info.mk
include check.mk

# for local testing
#HOST_IP := 127.0.0.1
#HTTP_PORT := 8686
VERSION := $(GIT_SHORT)

build: ## Build images: make build ver=1.2.1
	${INFO} "Building $(PROJECT) image..."
	@docker-compose -p $(PROJECT) build

up: ## Run requestor & responder in live mode
	${INFO} "Starting $(PROJECT), with 'up'..."``
	@docker-compose -p $(PROJECT) up

run: ## Run requestor & responder in daemon mode
	${INFO} "Running $(PROJECT), in daemon mode..."
	@docker-compose -p $(PROJECT) up -d

stop: ## Low level clean-up, stop containers
	${INFO} "Hard stop of $(PROJECT) containers..."
	@docker stop zeromq-http-responder
	@docker stop zeromq-http-requestor

clean: ## Low level clean-up - delete images
	${INFO} "Hard cleanup of $(PROJECT) image..."
	@docker image rmi zeromq-http-responder:$(VERSION)
	@docker image rmi zeromq-http-requestor:$(VERSION)

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
