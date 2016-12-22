// @flow

import jwt from 'jsonwebtoken';

import Parse from 'parse/node';

import Config from '../../config';
import logger from '../../utils/logger';

/* ***************************************************************************
API
*****************************************************************************/

const Register = (req, res, next) => {
  logger.debug(`in register...${JSON.stringify(req.body)}`);

  const newUser = new Parse.User();
  Object.keys(req.body).forEach((key) => {
    newUser.set(key, req.body[key]);
  });

  newUser.signUp(null, {
    success: (user) => {
      logger.debug(`sign up successfully...${JSON.stringify(user)}`);
      res.send('Reigster!!!');
    },
    error: (user, error) => {
      logger.debug(`sign up failed...${user} - ${error.code} - ${error.message} - ${Config.PARSE_SERVER_URL} - ${Config.PARSE_APP_ID}`);
      res.send('Fail...');
    },
  });
};

const Login = (req, res, next) => {
  logger.debug(`API/Login---->${JSON.stringify(req.body)}--${req.body.username}==>${req.body.password}`);
  Parse.User.logIn(req.body.username, req.body.password, {
    success: (user) => {
      logger.info(`Login success - ${user.constructor.name} - ${JSON.stringify(user)}`);
      const originalJWTPayload = {
        username: user.getUsername(),
        parseSessionToken: user.getSessionToken(),
        email: user.getEmail(),
      };
      logger.info(`----------jwt payload: ${JSON.stringify(originalJWTPayload)}`);
      const jwtToken = jwt.sign(originalJWTPayload, Config.JWT_SECRET);
      res.setHeader('Authorization', `Bearer ${jwtToken}`);
      res.send('Login successfully!!!');
    },
    error: (user, error) => {
      logger.error(`Login fail - ${JSON.stringify(user)} - ${JSON.stringify(error)}`);
      res.send('Login failed...');
    },
  });
};

const User = (req, res, next) => {

  res.send('User!!!');
};

const DeleteUser = (req, res, next) => {
  res.send('Delete User!!!');
};

export default {
  Register,
  Login,
  User,
  DeleteUser,
};
