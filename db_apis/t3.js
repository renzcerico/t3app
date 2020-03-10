const oracle = require('oracledb');
const database = require('../services/database.js');

const storeAll = async (data) => {
    let connect;
    try {
        connect = await oracle.getConnection();
        const query = `begin T3_PACKAGE.STORE_ALL(
                    :header_obj
                    , :activity_data
                    , :manpower_data
                    , :material_data
                    , :output
                );
            end;`;
        console.log('activity: ', data.activity_collection[1]);
        console.log('activity: ', data.dummy_activity_collection[0]);
        const headerObj = await connect.getDbObjectClass('T3.HEADER_OBJ');
        const header_obj = new headerObj(data.header_obj);
        const activityCollection = await connect.getDbObjectClass('T3.ACTIVITY_COLLECTION');
        const activity_data = new activityCollection(data.activity_collection);
        const manpowerCollection = await connect.getDbObjectClass('T3.MANPOWER_COLLECTION');
        const manpower_data = new manpowerCollection(data.manpower_collection);
        const materialCollection = await connect.getDbObjectClass('T3.MATERIAL_COLLECTION');
        const material_data = new materialCollection(data.material_collection);

        let binds = {
            header_obj: header_obj,
            activity_data: activity_data,
            manpower_data: manpower_data,
            material_data: material_data,
            output: {
                dir: oracle.BIND_OUT,
                type: oracle.NUMBER
            }
        }
        const result = await connect.execute(query, binds, {autoCommit: true})
        .catch(error => { console.log('caught', error.message); });
        return result.outBinds.output;
    } catch (err) {
        console.log(err);
    } finally {
        if (connect) {
            connect.close();
        }
    }
}

module.exports.storeAll = storeAll;


const getAllByBarcode = async (data) => {
    const header_q = `begin T3_PACKAGE.GET_HEADER_BY_BARCODE ( :barcode, :cursor); end;`;
    let header_binds = {
        barcode: data,
    }

    header_binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }

    const header_res = await database.resultsetExecute(header_q, header_binds)
    .catch(error => { console.log('caught', error.message); });
    let res = {};
    if (header_res.length > 0) {
        const activities = await getDataByHeaderId('TBL_ACTIVITY' , header_res[0].ID);
        const manpower = await getDataByHeaderId('TBL_MANPOWER' ,  header_res[0].ID);
        const materials = await getDataByHeaderId('TBL_MATERIAL' ,  header_res[0].ID);
        res = {
            header_obj          : header_res[0],
            activity_collection : activities,
            manpower_collection : manpower,
            materials_collection : materials,
        }
    }
    console.log(res.activity_collection);
    return res;
}

module.exports.getAllByBarcode = getAllByBarcode;

const getDataByHeaderId = async (table ,headerid) => {
    const q = `begin T3_PACKAGE.GET_DATA_BY_HEADER_ID ( :header_id, :table, :cursor ); end;`;
    let binds = {
        header_id: headerid,
        table: table
    };
    binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caught', error.message); });
    res.forEach(async (el, i) => {
        if (table == 'TBL_ACTIVITY') {
            const activity_deatils = await getActivityDetails(res[i].ID);
            res[i].ACTIVITY_DETAILS = activity_deatils;
        }
        res[i].IS_NEW = false;
        res[i].IS_CHANGED = false;
    });
    return res;
}

const getActivityDetails = async (activity_id) => {
    const q = `begin T3_PACKAGE.GET_ACTIVITY_DETAILS ( :activity_id, :cursor ); end;`;
    let binds = {
        activity_id: activity_id,
    };
    binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caught', error.message); });
    res.forEach((el, i) => {
        res[i].IS_NEW = false;
        res[i].IS_CHANGED = false;
    });
    return res;
}
