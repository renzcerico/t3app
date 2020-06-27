const t3 = require('../db_apis/t3.js');

const storeAll = async (req = {}, res, next = null) => {
    const data = {
        header_obj          : req.body.header_obj,
        activity_collection : req.body.activity_collection,
        manpower_collection : req.body.manpower_collection,
        material_collection : req.body.material_collection,
        user_id             : req.body.user_id
    };
    const request = await t3.storeAll(data)
    .catch(error => { console.log('caught', error.message); });
    res.status(201).json(request);
}

module.exports.storeAll = storeAll;

const getAllByBarcode = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getAllByBarcode(req.params.barcode)
        .catch(error => { console.log('caught', error.message); });
        if (Object.entries(request).length > 0) {
            request.isExisting = true;
            res.status(201).json(request);
        } else {
            const response = {
                isExisting: false
            };
            res.status(201).json(response);
        }
      } catch (err) {
        next(err);
      }
}

module.exports.getAllByBarcode = getAllByBarcode;

const getDowntimeTypes = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getDowntimeTypes()
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}

module.exports.getDowntimeTypes = getDowntimeTypes;

const getHeaderCountPerStatus = async (req = {}, res, next = null) => {
    try {
        const user = req.session.user;
        let user_id;
        (user ? user_id = user.ID : user_id = 0);
        const request = await t3.getHeaderCountPerStatus(user_id)
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}

module.exports.getHeaderCountPerStatus = getHeaderCountPerStatus;

const getHeaderByStatus = async (req = {}, res, next = null) => {
    try {
        const user = req.session.user;
        (user ? req.body.user_id = user.ID : req.body.user_id = 0);
        const request = await t3.getHeaderByStatus(req.body)
        .catch(error => { console.log('caught', error.message); });
        if (Object.entries(request).length > 0) {
            request.isExisting = true;
            res.status(201).json(request);
        } else {
            const response = {
                isExisting: false
            };
            res.status(201).json(response);
        }
      } catch (err) {
        next(err);
      }
}

module.exports.getHeaderByStatus = getHeaderByStatus;