const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');

const numRows = 10;  // number of rows to return from each call to getRows()

async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}

module.exports.initialize = initialize;

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;
 
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
 
    try {
      conn = await oracledb.getConnection();
 
      const result = await conn.execute(statement, binds, opts);
//  console.log(result)
      resolve(result);
    } catch (err) {
        reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}
 
module.exports.simpleExecute = simpleExecute;

async function simpleProcedureExecute(query, bindvars, opts = {}) {
  let rowss;
  let conn;
  let procJson = [];

  opts.outFormat = oracledb.OBJECT;
  opts.autoCommit = true;

  try {
      conn = await oracledb.getConnection();
      result = await conn.execute(query, bindvars, opts);
      rowss = await result.outBinds.result.getRows(1000);
      if (rowss.length) {
          for (var i = 0; i < rowss.length; i++) {
              procJson.push({});
              for (var j = 0; j < result.outBinds.result.metaData.length; j++) {
                  procJson[i][result.outBinds.result.metaData[j].name.toUpperCase()] = rowss[i][j];
              }
          }
      }
      return procJson;
  } catch (err) {
      console.log(err);
  } finally {
      if (conn) { // conn assignment worked, need to close
          try {
              await conn.close();
          } catch (err) {
              console.log(err);
          }
      }
  }
}

module.exports.simpleProcedureExecute = simpleProcedureExecute;

function resultsetExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {

    let connection;

    try {

      connection = await oracledb.getConnection();
  
      const result = await connection.execute(statement, binds);
      // console.log("Cursor metadata:");
      // console.log(result.outBinds.cursor.metaData);
  
      // Fetch rows from the REF CURSOR.
      // If getRows(numRows) returns:
      //   Zero rows               => there were no rows, or are no more rows to return
      //   Fewer than numRows rows => this was the last set of rows to get
      //   Exactly numRows rows    => there may be more rows to fetch
      const resultSet = result.outBinds.cursor;
      
      let procJson = [];
      let rows;
      let count = 0;
      do {
        rows = await resultSet.getRows(numRows); // get numRows rows at a time
        if (rows.length > 0) {
          // console.log("getRows(): Got " + rows.length + " rows");
          // console.log(count);
          
          for (var i = 0; i < rows.length; i++) {
            procJson.push({});
            for (var j = 0; j < resultSet.metaData.length; j++) {
                procJson[count][resultSet.metaData[j].name.toUpperCase()] = rows[i][j];
            }
            count++;
          }
        }
      } while (rows.length === numRows);
  
      // always close the ResultSet
      await resultSet.close();

      // console.log(procJson)
      resolve(procJson)
  
    } catch (err) {
      console.error(err);
      reject(err)
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }

  });
}
 
module.exports.resultsetExecute = resultsetExecute;
