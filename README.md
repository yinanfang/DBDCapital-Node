# DBDCapital-Node

## Quick Start
```shell
  $ npm install -g flow-bin
  $ npm install

  # Retrieve .env.development, .evn.production, dbd-capital.com.crt, dbd-capital,com.key, StartCom_root_bundle.crt

  $ make serve
```

### Unsecure dev page
- https://localhost:3000 -> Browser-Sync Auto refresh
- https://localhost:8843 -> Original Webpack server
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

## Note
- For babel-root-import exception:
  - https://github.com/michaelzoidl/babel-root-import#dont-let-eslint-be-confused
- flow-type
 - https://github.com/gajus/eslint-plugin-flowtype#configuration
