# DBDCapital-Node

## Quick Start
```shell
  $ npm install -g flow-bin
  $ npm install

  # Retrieve .env.development, .evn.production, dbd-capital.com.crt, dbd-capital,com.key, intermediate.crt, StartCom_root.crt

  $ make serve

  # In browser, open
  #   - Website: https://localhost:3000 -> Browser-Sync Auto refresh
  #   - Website: https://localhost:8843 -> Original Webpack server
  #   - Parse dashboard: https://localhost:8443/dashboard/apps
```

## MongoLab - Robomongo
- MongoLab: https://mlab.com/databases/dbdcapital
- Don't use "admin"! Connection Settings - Authentication - Database: dbdcapital


## Linter setup
```shell
  $ npm install --save-dev eslint eslint-plugin-react babel-eslint eslint-config-airbnb
  Install linter-eslint and react from "Install"
  Completely close and restart Atom
