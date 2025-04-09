const mysql = require('mysql');

var dbEnergy = mysql.createPool({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbenergy',
    multipleStatements: true   
});

module.exports = dbEnergy;