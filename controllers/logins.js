const logins = require('../db_apis/logins.js');
const session = require('express-session');
const database = require('../config/database.js');

function getLoginFromRec(req) {
    const login = {
      user: req.body.username,
      pass: req.body.password
    };
    
    return login;
}

  async function post(req, res, next) {
    try {
      let login = getLoginFromRec(req);
      login = await logins.setlogin(login);
      const user = login[0];

      if (login.length > 0) {
        session.user = user;
      }

      // if (login.length > 0) {
        res.status(201).json(user);
      // } else {
      //   res.status(401).end();
      // }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;

  const authenticate = async (req, res, next) => {
    try {
      const user = session.user;
      res.status(200).json(user);

    } catch(err) {
      next(err);
    }
  };

  module.exports.authenticate = authenticate;

  const logout = async (req, res, next) => {
    try {
      delete session.user;

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  module.exports.logout = logout;

  const forwardList = async (req, res, next) => {
    try {
        if (!session.user) {
          res.status(200).end();
        } else {
          const userLevel = session.user.USER_LEVEL;
          
          result = await logins.forwardList(userLevel);
          
          res.status(200).json(result);
        }
    } catch (err) {
      next(err);
    }
  };

  module.exports.forwardList = forwardList;