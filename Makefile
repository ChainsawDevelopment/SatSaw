PATH	:= $(CURDIR)/node_modules/.bin:$(PATH)

build: webpack dist/index.html

restore:
	yarn

webpack: restore
	webpack --config webpack.config.js -d

dist/index.html: src/index.html
	cp ./src/index.html ./dist/index.html

watch: build
	-webpack-dev-server

.PHONY: build webpack watch restore