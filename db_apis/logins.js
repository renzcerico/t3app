const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const loginSql =
 `begin T3_PACKAGE.validate_user(:user, :pass, :cursor); end;`;

async function setlogin(log) {

  const login = Object.assign({}, log);

  login.cursor = {
    dir: oracledb.BIND_OUT,
    type: oracledb.CURSOR
  }

  const result = await database.resultsetExecute(loginSql, login);
  
  return result;
}

module.exports.setlogin = setlogin;
