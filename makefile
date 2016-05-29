# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

serve: copy-config
	NODE_ENV=development nodemon --exec ./node_modules/babel-cli/bin/babel-node server

all:

setup:
	# npm install -g
	npm install --dev

build: clean
	NODE_ENV=production ./node_modules/babel-cli/bin/babel-node ./node_modules/webpack/bin/webpack --progress --profile --colors

copy-config:

test:

clean:
	rm -rf dist
