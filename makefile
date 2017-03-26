# Reference: https://github.com/djhi/my-nutrition/blob/master/makefile

##############################################################################
# Common task
##############################################################################

copy-config:

setup:
	# sudo mongod --dbpath /data/db/ --port 27017 --fork --logpath ./logg/mongodb.log

installAirbnbESLint:
	# https://www.npmjs.com/package/eslint-config-airbnb#eslint-config-airbnb-1

##############################################################################
# Dev
##############################################################################

dev:
	NODE_ENV=development nodemon --exec ./node_modules/babel-cli/bin/babel-node.js server

# Experimental feature after Node v6.3+ & Chrome 55+
# https://github.com/yinanfang/DBDCapital-Node/issues/47
debug:
	NODE_ENV=development babel-node --inspect server

debugWithWithBreak:
	NODE_ENV=development babel-node --inspect --debug-brk server

# Test
jasmineOnce:
	NODE_TLS_REJECT_UNAUTHORIZED=0 NODE_ENV=development ./node_modules/babel-cli/bin/babel-node.js jasmine.js
delay15Seconds:
	sleep 15
jasmineWithNodemon:
	NODE_TLS_REJECT_UNAUTHORIZED=0 NODE_ENV=development nodemon --delay 10 --config nodemon_jasmine.json --exec ./node_modules/babel-cli/bin/babel-node.js jasmine.js
jasmine: delay15Seconds jasmineWithNodemon
webClientTestDebug:
	NODE_TLS_REJECT_UNAUTHORIZED=0 NODE_ENV=development babel-node --inspect --debug-brk jasmine.js


##############################################################################
# Production
##############################################################################

clean:
	rm -rf dist

build: clean
	NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js ./node_modules/webpack/bin/webpack.js --progress --profile --colors --production

pm2:
	sudo pm2 start pm2_config.json

debug_pm2:
	sudo pm2 start pm2_config.json --no-daemon

# Deploy
updateAndRestart:
	git pull && npm install && make build && sudo pm2 restart all
