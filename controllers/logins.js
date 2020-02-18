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
      // let employee = getEmployeeFromRec(req);
      let login = getLoginFromRec(req);
      console.log(login);
      login = await logins.setlogin(login);
   
      if (login.bv === 'Y') {
        login = await logins.validLogin(login);
        delete login['user'];
        delete login['pass'];
        console.log(login);
      }

      res.status(201).json(login);

    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;