# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

default: clean copy-config
	nodemon --exec babel-node server

all:

build: clean
	webpack --progress --profile --colors

copy-config:

test:

clean:
	rm -rf dist
