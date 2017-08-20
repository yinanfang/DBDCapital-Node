# DBDCapital-Node

## Short Intro
[Isomorphic Application](https://www.lullabot.com/articles/what-is-an-isomorphic-application)

## Dev Quick Start
```shell
    npm install -g flow-bin
    npm install

    # Retrieve .env.development, .evn.production, dbd-capital.com.crt, dbd-capital,com.key, StartCom_root_bundle.crt

    make dev

    # Install correct eslint: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1
```

## Production Quick Start
```shell
    # Fresh start
    make build && make pm2

    # Update & Restart
    make updateAndRestart

    ##############################################################################
    # Options
    # Start with babel-node
    sudo NODE_ENV=production ./node_modules/babel-cli/bin/babel-node.js server
    # One line start
    sudo pm2 start index.js --no-daemon
    # pm2 list
    sudo pm2 ls
    # pm2 start with .json
    sudo pm2 start pm2_config.json
```

### Unsecure dev page
- https://localhost:3000 -> Browser-Sync Auto refresh
- https://localhost:8443 -> Original Webpack server
- https://localhost:8443/dashboard/apps -> Parse dashboard

### Secure dev page
- Add the following rule to /etc/hosts
```shell
# DBD Capital
127.0.0.1 dbd-capital.com
127.0.0.1 www.dbd-capital.com
```
- Find Browser-Sync url from console
- https://dbd-capital.com:8443
- https://www.dbd-capital.com:8443
- https://dbd-capital.com:8443/dashboard/apps

### Dependency update
```shell
    # Check available upgrades
    ncu
```

## MongoLab - Robomongo
- MongoLab: https://mlab.com/databases/dbdcapital
- Don't use "admin"! Connection Settings - Authentication - Database: dbdcapital
- Installation
```shell
    brew update && brew install mongodb
```    
- Kill mongod
```shell
    ps aux | grep mongo
    sudo kill #id
```

## Linter setup
```shell
  $ npm install --save-dev eslint eslint-plugin-react babel-eslint eslint-config-airbnb
  Install linter-eslint and react from "Install"
  Completely close and restart Atom
```

## Demo for external user NOT under the same wifi
- Use global localtunnel instead of BrowserSync tunnel to avoid modifying webpack configuration
- Guide:
  - comment out require https in server.js
  - make dev
  - lt --port 8080
- Alternative: ngrok


## Note
- For babel-root-import exception:
  - https://github.com/michaelzoidl/babel-root-import#dont-let-eslint-be-confused
- flow-type
 - https://github.com/gajus/eslint-plugin-flowtype#configuration
- Store jwt in Cookie according to
  - https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage

- Todo
  - https://camjackson.net/post/9-things-every-reactjs-beginner-should-know
    - Libraries: https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#-5-use-redux-js-use-redux-js-
      - Immutable.js, sage, reselect
    - Test with shallowRender(): https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#-7-use-shallow-rendering-use-shallow-rendering-
  - https://medium.com/@housecor/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc#.ho1ioqhhv
    - https://medium.com/@jefflindholm/personally-that-is-how-i-would-write-the-code-ccb036b50322#.q834f8k26


https://medium.com/@dan_abramov/react-components-elements-and-instances-90800811f8ca#.cx6foekli
https://medium.com/@housecor/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc#.mzql1zm99
