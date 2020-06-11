const oracledb = require('oracledb');
const database = require('../services/database.js');

const sqlInsert = "BEGIN T3_PACKAGE.INSERT_ACCOUNTS(:accounts, :id); END;";

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

    const result = await database.simpleExecute(sqlInsert, binds);
    console.log(result);
    return result;
};

module.exports.insert = insert;

const sqlGetAll = "BEGIN T3_PACKAGE.GET_ALL_ACCOUNTS(:cursor); END;";

const all = async () => {
    const binds = {};
    
    binds.cursor = {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
    }

    const result = await database.resultsetExecute(sqlGetAll, binds);

    return result;
};

module.exports.all = all;

const sqlGetById = "BEGIN T3_PACKAGE.GET_ACCOUNT_BY_ID(:id, :cursor); END;";

const getById = async (id) => {
    let binds = {};
    
    binds = {
        id: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            val: parseInt(id)
        },
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    }

    const result = await database.resultsetExecute(sqlGetById, binds);

    return result;
};

module.exports.getById = getById;