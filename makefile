# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

##############################################################################
# Common task
##############################################################################

copy-config:

setup:
	# sudo mongod --dbpath /data/db/ --port 27017 --fork --logpath ./logg/mongodb.log

##############################################################################
# Dev
##############################################################################

dev:
	NODE_ENV=development nodemon --exec ./node_modules/babel-cli/bin/babel-node.js server

##############################################################################
# Production
##############################################################################

clean:
	rm -rf dist

build: clean
	NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js ./node_modules/webpack/bin/webpack.js --progress --profile --colors --production

prod:
	# sudo NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js server

pm2:
	# sudo pm2 start index.js --no-daemon
	# sudo pm2 ls
	sudo pm2 start pm2_config.json # --no-daemon

# Test
jasmine:
	sleep 15
	NODE_TLS_REJECT_UNAUTHORIZED=0 NODE_ENV=development nodemon --config nodemon_jasmine.json --exec ./node_modules/babel-cli/bin/babel-node.js jasmine.js
