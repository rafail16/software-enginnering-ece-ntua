const mysql = require('mysql');

var dbUsers = mysql.createConnection({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbusers',
    multipleStatements: true   
}); 

module.exports = dbUsers;