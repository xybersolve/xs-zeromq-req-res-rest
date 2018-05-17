.PHONY: build up run stop down clean  delete ssh archive ping increment help

project := zermq-http-req-res
host_name := $(shell docker-machine active)
#host_ip := $(shell docker-machine ip $(host_name))
host_ip := 127.0.0.1
http_port := 8686
version := $(ver)
# check for verion argument, or set to 'duh'

build: ## Build images: make build ver=1.2.1
	@echo Version: $(version)
	#docker-compose -p $(project) -e VERSION=$(version) build

check-version:
	if test "$(version)" = "" ; then \
		echo "ver not set"; \
		exit 1; \
	fi
	# ifeq ($(ver),)
	#   $(error ver is not set)
	# endif
	# ifndef version
	#   $(error version is required: make build ver=1.2.1)
	# endif

up: ## Run requestor & responder in live mode
	docker-compose -p $(project) up

run: ## Run requestor & responder in daemon mode
	docker-compose -p $(project) up -d

stop:
	# low level clean-up
	docker stop zeromq-http-responder
	docker stop zeromq-http-requestor

clean: down
	# low level clean-up - delete images
	docker rmi zeromq-http-responder
	docker rmi zeromq-http-requestor

down: ## Clean up requestor & server
	docker-compose -p $(project) down

ssh: ## SSH into container
	docker run -it --rm zeromq-req-res-http /bin/bash

archive: ## Archive images
	docker save -o ../image-archive/zeromq-req-res-promise.tar zeromq-req-res-promise

ping:
	curl http://$(host_ip):$(http_port)/ping

increment:
	curl http://$(host_ip):$(http_port)/increment/15
	# open http://$(host_ip):$(http_port)/increment/15

help: ## This help file
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sort \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
