PATH				:= $(CURDIR)/node_modules/.bin:$(PATH)
WEBPACK_ARGS 		?= -d
API_PORT			?= 3000
API_BASE_URL		?= http://localhost:$(API_PORT)/
ALLOW_ALL_ORIGINS	?= 1

build: webpack dist/index.html

restore:
	yarn

webpack: restore
	webpack --config webpack.config.js $(WEBPACK_ARGS)

dist/index.html: src/index.html
	cat ./src/index.html | sed s={API_BASE_URL}="$(API_BASE_URL)"=g > ./dist/index.html

watch: restore dist/index.html
	-webpack-dev-server $(WEBPACK_ARGS)

api:
	node api/index.js $(API_PORT) $(ALLOW_ALL_ORIGINS)

.PHONY: build webpack watch restore api