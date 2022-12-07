IMAGE ?= aadah
CONTAINER ?= website
DB_USER ?= user
DB_PASS ?= pass
WORK_DIR ?= $(shell pwd)
DB_DIR ?= $(WORK_DIR)/db
PORT ?= 80

.PHONY: all
all: clean build serve

# `clean` SHOULD NOT access, delete, or otherwise alter the contents of DB_DIR.
.PHONY: clean
clean: stop remove

.PHONY: build
build:
	npm install
	mkdir -p $(DB_DIR)
	sudo chown -R $(USER) $(DB_DIR)
	docker build -t $(IMAGE) ./

.PHONY: serve
serve:
	@docker run \
		--name $(CONTAINER) \
		-d \
		-p $(PORT):$(PORT) \
		-e PORT=$(PORT) \
		-e DB_USER=$(DB_USER) \
		-e DB_PASS=$(DB_PASS) \
		-e MONGO_INITDB_ROOT_USERNAME=$(DB_USER) \
		-e MONGO_INITDB_ROOT_PASSWORD=$(DB_PASS) \
		-v $(DB_DIR):/data/db \
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
