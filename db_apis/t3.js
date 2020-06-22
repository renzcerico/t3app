const oracle = require('oracledb');
const database = require('../services/database.js');
const session = require('express-session');

const storeAll = async (data) => {
    let connect;
    try {
        connect = await oracle.getConnection();
        const query = `begin T3_PACKAGE.STORE_ALL(
                    :header_obj
                    , :activity_data
                    , :manpower_data
                    , :material_data
                    , :user_id
                    , :output
                );
            end;`;
        // console.log('activity: ', data.activity_collection[1]);
        // console.log('activity: ', data.dummy_activity_collection[0]);
        const headerObj = await connect.getDbObjectClass('T3.HEADER_OBJ')
        .catch(error => { console.log('caught', error.message); });
        const header_obj = new headerObj(data.header_obj);
        const activityCollection = await connect.getDbObjectClass('T3.ACTIVITY_COLLECTION')
        .catch(error => { console.log('caught', error.message); });
        const activity_data = new activityCollection(data.activity_collection);
        const manpowerCollection = await connect.getDbObjectClass('T3.MANPOWER_COLLECTION')
        .catch(error => { console.log('caught', error.message); });
        const manpower_data = new manpowerCollection(data.manpower_collection);
        const materialCollection = await connect.getDbObjectClass('T3.MATERIAL_COLLECTION')
        .catch(error => { console.log('caught', error.message); });
        const material_data = new materialCollection(data.material_collection);

        let binds = {
            header_obj: header_obj,
            activity_data: activity_data,
            manpower_data: manpower_data,
            material_data: material_data,
            user_id: data.user_id,
            output: {
                dir: oracle.BIND_OUT,
                type: oracle.NUMBER
            }
        }
        console.log('BINDS: ', binds);
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
    // console.log(res.activity_collection);
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
            const activity_details = await getActivityDetails(res[i].ID);
            res[i].ACTIVITY_DETAILS = activity_details;
            const activity_downtime = await getActivityDowntime(res[i].ID);
            res[i].ACTIVITY_DOWNTIME = activity_downtime;
        }
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
    return res;
}

const getActivityDowntime = async (activity_id) => {
    const q = `begin T3_PACKAGE.GET_ACTIVITY_DOWNTIME ( :activity_id, :cursor ); end;`;
    let binds = {
        activity_id: activity_id,
    };
    binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caught', error.message); });
    return res;
}

const getDowntimeTypes = async () => {
    const q = `BEGIN T3_PACKAGE.GET_DOWNTIME_TYPES (:cursor); END;`;
    let binds = {
        cursor: {
            dir: oracle.BIND_OUT,
            type: oracle.CURSOR
        }
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caugth', error.message)});
    return res;
}

module.exports.getDowntimeTypes = getDowntimeTypes;

const getHeaderCountPerStatus = async () => {
    let q = `BEGIN T3_PACKAGE.GET_HEADER_COUNT_PER_STATUS (:isLoggedIn, :cursor); END;`;
    
    if (!session.user) {
        isLoggedIn = 0;
    } else {
        isLoggedIn = session.user.ID;
    }

    let binds = {
        isLoggedIn: isLoggedIn,
        cursor: {
            dir: oracle.BIND_OUT,
            type: oracle.CURSOR
        }
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caugth', error.message)});
    return res;
}

module.exports.getHeaderCountPerStatus = getHeaderCountPerStatus;

const getHeaderByStatus = async (data) => {
    console.log(data);
    const header_q = `begin T3_PACKAGE.GET_HEADER_BY_STATUS ( :status_code, :cursor); end;`;
    let header_binds = {
        status_code: data,
    }

    header_binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }

    const header_res = await database.resultsetExecute(header_q, header_binds)
        .catch(error => { console.log('caught', error.message); });
    let res = {};
    return header_res;
}

module.exports.getHeaderByStatus = getHeaderByStatus;
