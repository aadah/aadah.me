IMAGE = aadah
SERVICE = website

WORK_DIR ?= $(shell pwd)

# Used within `docker compose` YAML config.
HTTP_PORT ?= 80
DB_USER ?= user
DB_PASS ?= pass
DB ?= admin
DB_DIR ?= $(WORK_DIR)/db

# Exported so present in `env` when `docker compose` is run.
export HTTP_PORT
export DB_USER
export DB_PASS
export DB
export DB_DIR

.PHONY: all
all: clean build start

# `clean` SHOULD NOT access, delete, or otherwise alter the contents of DB_DIR.
.PHONY: clean
clean: stop

.PHONY: build
build:
	mkdir -p $(DB_DIR)
	sudo chown -R $(USER) $(DB_DIR)
	docker build -t $(IMAGE) $(WORK_DIR)

.PHONY: start
start:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		up

.PHONY: stop
stop:
	-docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		down

.PHONY: enter
enter:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		bash

.PHONY: save
save:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		node cli.js manuscripts/blog/$(POSTID).txt -s

.PHONY: tweak
tweak:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		node cli.js manuscripts/blog/$(POSTID).txt -t

.PHONY: publish
publish:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		node cli.js manuscripts/blog/$(POSTID).txt -p

.PHONY: reveal
reveal:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		node cli.js manuscripts/blog/$(POSTID).txt -r

.PHONY: hide
hide:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		node cli.js manuscripts/blog/$(POSTID).txt -h

.PHONY: delete
delete:
	docker compose \
		-f $(WORK_DIR)/docker-compose.yaml \
		exec $(SERVICE) \
		node cli.js manuscripts/blog/$(POSTID).txt -d

# Used to make writing flow simpler. Not for use on main site.
.PHONY: live-edit
live-edit:
	while inotifywait -e modify manuscripts/blog/$(POSTID).txt; do make publish; done
