const mysql = require('mysql');
const importer = require('node-mysql-importer')
var host = '172.17.0.1';
var user = 'root';
var password = 'password';
var database = 'jablotron';
var sql_file = './tables.sql';
module.exports = {
  name: 'jablotron',
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4567,
  host: host,
  user: user,
  password: password,
  database: database,
  db: {
    get : mysql.createConnection({
      host     : host,
      user     : user,
      password : password,
      database : database
    }),
    importCon: importer.config({
      'host': host,
      'user': user,
      'password': password,
      'database': database
    }),
    importSql: importer.importSQL('./tables.sql').then( () => {
    }).catch( err => {
      console.log(`error: ${err}`)
    })
  }
};
