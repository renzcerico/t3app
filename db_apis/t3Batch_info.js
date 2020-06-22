const oracledb = require('oracledb');
const database = require('../services/database.js');

const sql = 
    `BEGIN MY_PKG.get_t3batch_info(163178, 128020, 821970, :t3_outbv, :t3_outbv2 ); END;`;

const getBatchinfo = async () => {

    let connect;
    try {

        connect = await oracledb.getConnection();
        const t3Header_type = await connect.getDbObjectClass("xxdom.t_t3header_type");
        const t3Material_type = await connect.getDbObjectClass("xxdom.t_t3materials_type");
        
        const binds = {
            t3_outbv: {
                dir: oracledb.BIND_OUT,
                type: t3Header_type
            },
            t3_outbv2: {
                dir: oracledb.BIND_OUT,
                type: t3Material_type
            }
        };
        
        // binds.t3_outbv = {
        //     dir: oracledb.BIND_OUT,
        //     type: t3Header_type
        // }
        
        result = await database.simpleExecute(sql, binds);

        const data = {
            batch_collection: JSON.parse(JSON.stringify(result.outBinds.t3_outbv)),
            material_collection: JSON.parse(JSON.stringify(result.outBinds.t3_outbv2))
        }

        return data ;
 
    } catch (erro) {
        console.error(erro);
    } finally {
        if (connect) {
            await connect.close({drop: true});
        }
    }            
};

module.exports.getBatchinfo = getBatchinfo;