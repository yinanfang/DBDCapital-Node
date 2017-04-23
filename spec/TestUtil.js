// @flow

import notifier from 'node-notifier';
import Nightmare from 'nightmare';

import logger from '../utils/logger';
import { Role as GCUserRole } from '../model/GCUser';

const GeneralErrorHandler = (done: () => void, error: Error, res: any = null) => {
  if (error) {
    notifier.notify({
      title: 'Unexpected Jasmine test error',
      message: error.stack,
      sound: true,
      wait: true,
    });
    logger.error(error.stack);
    done.fail(error);
  } else {
    done();
  }
};

const MOBILE = 'mobile';
const DESKTOP = 'desktop';

const getBrowser = (platform: string = DESKTOP) => {
  const nightmare = Nightmare({
    // show: true,
    typeInterval: 1,
    waitTimeout: 5000,
    switches: {
      'ignore-certificate-errors': true,
    },
  })
  .cookies.clearAll();
  if (platform === MOBILE) {
    nightmare.useragent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16');
    nightmare.viewport(420, 740);
  } else {
    // nightmare.viewport(960, 660);
    nightmare.viewport(1080, 860);
  }
  return nightmare;
};

const TestUser = {
  _id: '',
  token: '',
  username: 'dbdcapital_test',
  password: 'password',
  type: GCUserRole.ADMIN,
  email: 'dbdcapital_test@dbd-capital.com',
  account: {
    _id: '',
    ownerId: '',
    name: 'Client Account',
    stockBuyFeeRate: 0.0052,
    stockSellFeeRate: 0.0021,
  },
};

export default {
  GeneralErrorHandler,
  getBrowser,
  DEFAULT_TEST_USER: TestUser,
};
