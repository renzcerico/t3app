const logins = require('../db_apis/logins.js');
const session = require('express-session');

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
      // console.log(login);

      if (login.length > 0) {
          session.user = login;
      }

      // if (login.length > 0) {
        res.status(201).json(login);
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
