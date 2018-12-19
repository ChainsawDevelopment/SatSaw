PATH			:= $(CURDIR)/node_modules/.bin:$(PATH)
WEBPACK_ARGS 	?= -d
API_PORT		?= 3000

build: webpack dist/index.html

restore:
	yarn

webpack: restore
	webpack --config webpack.config.js $(WEBPACK_ARGS)

dist/index.html: src/index.html
	cp ./src/index.html ./dist/index.html

watch: restore dist/index.html
	-webpack-dev-server $(WEBPACK_ARGS)

api:
	node api/index.js $(API_PORT)

.PHONY: build webpack watch restore api