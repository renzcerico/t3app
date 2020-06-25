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

    const result = await database.simpleExecute(sqlInsert, binds);
    return result;
};

module.exports.insert = insert;

const sqlGetAll = "BEGIN T3_PACKAGE.GET_ALL_ACCOUNTS(:show_count, :page_number, :search_val, :order_by, :order_order, :cursor, :counter); END;";

const all = async (data) => {
    console.log("\x1b[36m",data, "\x1b[0m");
    const binds = data;
    
    binds.cursor = {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
    }

    binds.counter = {
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

const sqlResetPassword = `BEGIN T3_PACKAGE.RESET_PASSWORD(:id, :output); END;`;

const resetPassword = async (id) => {
    const binds = {
        id: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            val: parseInt(id)
        },
        output: {
            dir: oracledb.BIND_OUT,
            type: oracledb.VARCHAR
        }
    };

    const result = await database.simpleExecute(sqlResetPassword, binds);

    return result;
};

module.exports.resetPassword = resetPassword;