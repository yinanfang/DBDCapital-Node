// @flow

import jwt from 'jsonwebtoken';

import Parse from 'parse/node';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

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

const PassportLocal = (req, res, next) => {
  passport.use(new LocalStrategy((username, password, done) => {
    logger.debug(`passport local strategy---->${username}==>${password}`);
    Parse.User.logIn(username, password, {
      success: (user) => {
        logger.info(`Login success - ${user.constructor.name} - ${JSON.stringify(user)}`);
        return done(null, user);
      },
      error: (user, error) => {
        logger.error(`Login fail - ${JSON.stringify(user)} - ${JSON.stringify(error)}`);
        return done(null, false, {
          message: error,
        });
      },
    });
  }));
  next();
};

const Login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a Parse user is found
    if (user) {
      const originalJWTPayload = {
        username: user.getUsername(),
        parseSessionToken: user.getSessionToken(),
        email: user.getEmail(),
      };
      logger.info(`----------jwt payload: ${JSON.stringify(originalJWTPayload)}`);
      const token = jwt.sign(originalJWTPayload, Config.JWT_SECRET);
      res.status(200);
      res.json({
        message: 'Login successfully!!!',
        token,
      });
    } else {
      // If user is not found
      res.status(401).json({
        message: 'Login failed...',
        info,
      });
    }
  })(req, res);
};

const User = (req, res, next) => {
  res.send('User!!!');
};

const DeleteUser = (req, res, next) => {
  res.send('Delete User!!!');
};

export default {
  Register,
  PassportLocal,
  Login,
  User,
  DeleteUser,
};
