const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');
const fs = require('fs');
const mysql = require('mysql');

var dbUsers = mysql.createConnection({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbusers',
    multipleStatements: true
});

dbUsers.connect((err, con) => {
    if (err) {
        throw err;
    }
});

module.exports = async (req, res, next) => {
    const token = req.headers['x-observatory-auth'];
    const decoded = jwt.verify(token, credentials.secret);
    let limit;
    const username = decoded.username;
    dbUsers.query('SELECT * FROM dbuser WHERE username = ?', [username], (err, result) => {
        if (!err) {
            if (result.length < 1) {
                res.status(401).json({
                    message: "Authintication failed, user doesn't exist",
                    status: "401"
                });
            }
            else {
                limit = fs.readFileSync('C:/Users/andre/Desktop/softeng/back-end/config/limit.txt','utf-8');
                if (limit != '') {
                    if (limit == '0') {
                        return res.status(402).json({
                            message: 'Quota limit reached',
                            status: '402'
                        });
                    }
                    let temp = parseInt(limit);
                    fs.writeFileSync('C:/Users/andre/Desktop/softeng/back-end/config/limit.txt', --temp, 'utf-8');
                }
                next();
            }
        }
        else {
            return res.status(400).json({
                message: 'Bad request',
                status: '400'
            });
        }
    });
};