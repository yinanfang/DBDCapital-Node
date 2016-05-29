# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

serve: copy-config
	NODE_ENV=development nodemon --exec babel-node server

all:

setup:
	npm install --dev

build: clean
	NODE_ENV=production webpack --progress --profile --colors

copy-config:

test:

clean:
	rm -rf dist
