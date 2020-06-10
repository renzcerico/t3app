const oracledb = require('oracledb');
const database = require('../services/database.js');

const sql = "BEGIN T3_PACKAGE.INSERT_ACCOUNTS(:accounts, :id); END;";

const insert = async (data) => {
    // const accounts = Object.assign({}, data);
    let connect = await oracledb.getConnection();
    const acctObj = await connect.getDbObjectClass('T3.ACCOUNT_OBJ')
    const accounts = new acctObj(data);

    const binds = {
        accounts: accounts,
        id: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER
        }
    };

    console.log(binds);

    const result = await database.simpleExecute(sql, binds);
    console.log(result);
    return result;
};

module.exports.insert = insert;