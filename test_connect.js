var oracledb = require('oracledb');
// var dbConfig = require('./dbconfig.js');

const connection = oracledb.getConnection(
{
user : 't3',
password : 'oracle',
connectString : 'localhost:1521'
},
async function(err, connection)
{
if (err) {
console.error(err.message);
return;
}

await connection.getDbObjectClass('T3_PACKAGE')
.catch(error => { console.log('caught', error.message); });

const res = await connection.execute('SELECT CUSTOMER FROM TBL_HEADER');

console.log('connection: ' , res.rows );
console.log('Connection was successful!');
connection.close(
function(err)
{
if (err) {
console.error(err.message);
return;
}
});
});
