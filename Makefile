PATH	:= $(CURDIR)/node_modules/.bin:$(PATH)

build: webpack wwwroot/index.html

restore:
	yarn

webpack: restore
	webpack --config webpack.config.js -d

dist/index.html: src/index.html
	cp ./Frontend/index.html ./wwwroot/index.html

watch: build
	-webpack-dev-server

.PHONY: build webpack watch restore