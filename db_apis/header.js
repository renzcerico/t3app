const oracle = require('oracledb');
const database = require('../services/database.js');

const qry = ``;

const post = async (data) => {
    const header = Object.assign({}, data);

    const result = await database.simpleExecute(qry, header)

    return result;
};

module.exports.post = post;