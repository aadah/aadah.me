IMAGE ?= aadah
CONTAINER ?= website
WORK_DIR ?= $(shell pwd)

AADAH_PORT ?= port
AADAH_DB ?= db
AADAH_DB_USER ?= user
AADAH_DB_PASS ?= pass
AADAH_DB_HOST ?= host
AADAH_DB_PORT ?= port
AADAH_DB_DIR ?= $(WORK_DIR)/db


.PHONY: all
all: clean build serve

# `clean` SHOULD NOT access, delete, or otherwise alter the contents of AADAH_DB_DIR.
.PHONY: clean
clean: stop remove

.PHONY: build
build:
	npm install
	mkdir -p $(AADAH_DB_DIR)
	sudo chown -R $(USER) $(AADAH_DB_DIR)
	docker build -t $(IMAGE) ./

.PHONY: serve
serve:
	@docker run \
		--name $(CONTAINER) \
		-d \
		-p $(AADAH_PORT):$(AADAH_PORT) \
		-e AADAH_PORT=$(AADAH_PORT) \
		-e AADAH_DB=$(AADAH_DB) \
		-e AADAH_DB_USER=$(AADAH_DB_USER) \
		-e AADAH_DB_PASS=$(AADAH_DB_PASS) \
		-e AADAH_DB_HOST=$(AADAH_DB_HOST) \
		-e AADAH_DB_PORT=$(AADAH_DB_PORT) \
		-e MONGO_INITDB_ROOT_USERNAME=$(AADAH_DB_USER) \
		-e MONGO_INITDB_ROOT_PASSWORD=$(AADAH_DB_PASS) \
		-v $(AADAH_DB_DIR):/data/db \
		-v $(WORK_DIR):/aadah \
		$(IMAGE)
	docker exec -it $(CONTAINER) npm start

.PHONY: stop
stop:
	-docker container stop $(CONTAINER)

.PHONY: remove
remove:
	-docker container rm $(CONTAINER)

.PHONY: enter
enter:
	docker exec -it $(CONTAINER) bash

.PHONY: save
save:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(POSTID).txt -s

.PHONY: publish
publish:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(POSTID).txt -p

.PHONY: reveal
reveal:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(POSTID).txt -r

.PHONY: hide
hide:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(POSTID).txt -h

.PHONY: delete
delete:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(POSTID).txt -d

# Used to make writing flow simpler. Not for use on main site.
.PHONY: live-edit
live-edit:
	while inotifywait -e modify manuscripts/$(POSTID).txt; do make publish; done
