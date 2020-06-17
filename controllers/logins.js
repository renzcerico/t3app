const logins = require('../db_apis/logins.js');
 
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
      console.log(login);

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