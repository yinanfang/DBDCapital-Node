# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

serve: copy-config
	NODE_ENV=development nodemon --exec ./node_modules/babel-cli/bin/babel-node.js server

all:

setup:

build: clean
	NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js ./node_modules/webpack/bin/webpack.js --progress --profile --colors

copy-config:

test:

clean:
	rm -rf dist
