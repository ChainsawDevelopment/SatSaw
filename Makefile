PATH	:= $(CURDIR)/node_modules/.bin:$(PATH)

build: webpack dist/index.html

restore:
	yarn

webpack: restore
	webpack --config webpack.config.js -d

dist/index.html: src/index.html
	cp ./src/index.html ./dist/index.html

watch: restore dist/index.html
	-webpack-dev-server

.PHONY: build webpack watch restore