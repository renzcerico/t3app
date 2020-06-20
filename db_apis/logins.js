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

const forwardListSql = `BEGIN T3_PACKAGE.FORWARD_LIST(:userLevel, :cursor); END;`;

const forwardList = async (userLevel) => {
  const bind = {
    userLevel: userLevel.toLowerCase(),
    cursor: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR
    }
  };
  console.log(bind);
  const result = await database.resultsetExecute(forwardListSql, bind);

  return result;
};

module.exports.forwardList = forwardList;