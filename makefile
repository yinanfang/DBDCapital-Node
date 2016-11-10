# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

# Common task
copy-config:

setup:
	# sudo mongod --dbpath /data/db/ --port 27017 --fork --logpath ./logg/mongodb.log

# Dev
dev:
	NODE_ENV=development nodemon --exec ./node_modules/babel-cli/bin/babel-node.js server


# Production
clean:
	rm -rf dist

build: clean
	NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js ./node_modules/webpack/bin/webpack.js --progress --profile --colors --production

prod: build
	sudo NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js server
