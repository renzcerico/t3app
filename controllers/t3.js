const t3 = require('../db_apis/t3.js');

const storeAll = async (req = {}, res, next = null) => {
    const manpower_collection = [
        {ID : null, POSITION_ID : 1, MANPOWER_ID : 1, START_TIME : '29/FEB/20', END_TIME : '29/FEB/20', REMARKS : 'REMARKS', LAST_UPDATED_BY : 1, DATE_ENTERED : '29/FEB/20', DATE_UPDATED :'29/FEB/20'},
        {ID : null, POSITION_ID : 1, MANPOWER_ID : 1, START_TIME : '29/FEB/20', END_TIME : '29/FEB/20', REMARKS : 'REMARKS', LAST_UPDATED_BY : 1,DATE_ENTERED : '29/FEB/20',DATE_UPDATED :'29/FEB/20'}
    ]
    const material_collection = [
        {ID: null, QUANTITY: 500, STANDARD: 1, REQUIREMENTS: 500, USED: 500, REJECT: 0, REMARKS: 'remarks', LAST_UPDATED_BY: 1, DATE_ENTERED: '29/FEB/20', DATE_UPDATED: '29/FEB/20', MATERIAL_CODE: '1231313'},
        {ID: null, QUANTITY: 500, STANDARD: 1, REQUIREMENTS: 500, USED: 500, REJECT: 0, REMARKS: 'remarks', LAST_UPDATED_BY: 1, DATE_ENTERED: '29/FEB/20', DATE_UPDATED: '29/FEB/20', MATERIAL_CODE: '1231313'}
    ]
    let activities = req.body.activity_collection;
    activities.forEach((element, index) => {
        activities[index].END_TIME = element._END_TIME;
        activities[index].START_TIME = element._START_TIME;
    });

    const data = {
        header_obj          : req.body.header_obj,
        // dummy_header        : header_obj,
        activity_collection : req.body.activity_collection,
        // dummy_activity_collection : activity_collection,
        manpower_collection : manpower_collection,
        material_collection : material_collection
    };
    console.log('data: ', req.body.activity_collection[3].ACTIVITY_DETAILS);
    const request = await t3.storeAll(data)
    .catch(error => { console.log('caught', error.message); });
    res.status(201).json(request);
}

module.exports.storeAll = storeAll;

const getAllByBarcode = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getAllByBarcode(req.params.barcode)
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
      } catch (err) {
        next(err);
      }
}

module.exports.getAllByBarcode = getAllByBarcode;