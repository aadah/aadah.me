IMAGE ?= aadah
CONTAINER ?= website
DB_USER ?= user
DB_PASS ?= pass
DB_DIR ?= $(PWD)/db

.PHONY: all
all: clean build serve

# `clean` should *not* tamper with contents of DB_DIR.
.PHONY: clean
clean: stop remove

.PHONY: build
build:
	npm install
	docker build -t $(IMAGE) ./

.PHONY: serve
serve:
	mkdir -p $(DB_DIR)
	@docker run \
		--name $(CONTAINER) \
		-d \
		-p 80:80 \
		-e MONGO_INITDB_ROOT_USERNAME=$(DB_USER) \
		-e MONGO_INITDB_ROOT_PASSWORD=$(DB_PASS) \
		-v $(DB_DIR):/data/db \
		-v $(PWD):/aadah \
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
		node cli.js manuscripts/$(ID).txt -s

.PHONY: publish
publish:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(ID).txt -p

.PHONY: reveal
reveal:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(ID).txt -r

.PHONY: hide
hide:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(ID).txt -h

.PHONY: delete
delete:
	docker exec -it $(CONTAINER) \
		node cli.js manuscripts/$(ID).txt -d