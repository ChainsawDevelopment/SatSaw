PATH			:= $(CURDIR)/node_modules/.bin:$(PATH)
WEBPACK_ARGS 	?= -d

build: webpack dist/index.html

restore:
	yarn

webpack: restore
	webpack --config webpack.config.js $(WEBPACK_ARGS)

dist/index.html: src/index.html
	cp ./src/index.html ./dist/index.html

watch: restore dist/index.html
	-webpack-dev-server $(WEBPACK_ARGS)

.PHONY: build webpack watch restore