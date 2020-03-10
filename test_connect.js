var oracledb = require('oracledb');
// var dbConfig = require('./dbconfig.js');

const connection = oracledb.getConnection(
{
user : 't3',
password : 'oracle',
connectString : 'localhost:1521/xe'
},
async function(err, connection)
{
    if (err) {
    console.error(err.message);
    return;
    }

    // await connection.execute(`
    // CREATE TYPE ACTIVITY_COLLECTION IS TABLE OF NUMBER;
    // `);
    const headerRec = await connection.getDbObjectClass('T3.HEADER_RECORD')
    .catch(error => { console.log('caught', error.message); });
    const header = new headerRec({
        ID                  : null,
        BARCODE             : 'test 12345',
        ACTUAL_START        : '12/FEB/20',
        ACTUAL_END          : '12/FEB/20',
        STATUS              : 'test',
        PO_NUMBER           : '12345',
        CONTROL_NUMBER      : '54321',
        SHIPPING_DATE       : '12/FEB/20',
        ORDER_QUANTITY      : 500,
        CUSTOMER            : 'renz',
        CUSTOMER_CODE       : 'martin',
        CUSTOMER_SPEC       : 'cerico',
        OLD_CODE            : 'hehez',
        INTERNAL_CODE       : '12345',
        PRODUCT_DESCRIPTION : '54321'
    })
    console.log('Connection was successful!', connection);
    connection.close(
        function(err)
        {
            if (err) {
                console.error(err.message);
                return;
            }
        });
    });
    