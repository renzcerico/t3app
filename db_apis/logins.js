const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const loginSql =
 `begin my_pkg.validate_user(:user, :pass, :bv); end;`;

async function setlogin(log) {

  const login = Object.assign({}, log);

  login.bv = {
    dir: oracledb.BIND_OUT,
    type: oracledb.CHAR
  }

  const result = await database.simpleExecute(loginSql, login);

  login.bv = result.outBinds.bv[0];
  
  return login;
}

module.exports.setlogin = setlogin;

const loginSql2 =
 `begin my_pkg.erp_users(:user, :pass, 'attribute8', :bv); end;`;

async function validLogin(log) {

  const login = Object.assign({}, log);

  login.bv = {
    dir: oracledb.BIND_OUT,
    type: oracledb.VARCHAR
  }

  const result = await database.simpleExecute(loginSql2, login);

  login.bv = result.outBinds.bv;
  
  return login;
}

module.exports.validLogin = validLogin;
