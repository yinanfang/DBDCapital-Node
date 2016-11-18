// @flow

import Parse from 'parse/node';

import logger from '../utils/logger';

Parse.Cloud.define('deleteUser', (req, res) => {
  const query = new Parse.Query(Parse.User);
  logger.info(JSON.stringify(req.params));
  query.equalTo('username', req.params.username);  // find all the women
  query.find({
    success: (User) => {
      User[0].destroy({
        useMasterKey: true,
        success: () => {
          logger.info('deleted...');
          res.success('Success');
        },
        error: (error) => {
          logger.info(`Could not delete object ${User.id}`);
          res.error('Failed!');
        },
      });
    },
    error: (object, error) => {
      res.error('User could not found');
    },
  });
});

// Parse.Cloud.define('deleteUser', (request, response) => {
//   // const User = Parse.Object.extend('User');
//   const query = new Parse.Query(Parse.User);
//   const userID = request.params.userID;
//   query.get(userID,{
//     success: (User) => {
//       const message = 'success';
//       User.destroy({
//         useMasterKey: true ,
//           success:() => {
//           response.success(message);
//           return;
//         },
//         error:(error) => {
//           response.error('Could not delete object '+ User.id);
//           return;
//         }
//       });
//     },
//     error: (object, error) => {
//     var message = 'User could not found';
//     response.error(message);
//   }
//   });
// });
