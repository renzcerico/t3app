const accounts = require('../db_apis/accounts');

const insert = async (req, res, next) => {
    try {
        const data = {
            ID: null,
            FIRST_NAME: req.body.firstName,
            MIDDLE_NAME: req.body.middleName,
            LAST_NAME: req.body.lastName,
            GENDER: req.body.gender,
            USER_LEVEL: req.body.userLevel,
            CREATED_AT: null,
            USERNAME: req.body.username,
            PASSWORD: null  
        };

        const result = await accounts.insert(data);
        const id = result.outBinds.id;

        if (id > 0) {
            res.status(200).json(result);
        } else {
            res.status(409).end();
        }
    } catch (err) {
        next(err);
    }
};

module.exports.insert = insert;