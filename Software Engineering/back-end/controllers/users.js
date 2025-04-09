const mysql = require('mysql');
const model = require('mysql-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RandExp = require('randexp');
const fs = require('fs');
const fastcsv = require("fast-csv");
const csvToJson = require("convert-csv-to-json");
const formidable = require("formidable");
const credentials = require('../config/credentials');

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

var dbEnergy = mysql.createConnection({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbenergy',
    multipleStatements: true
});

dbEnergy.connect((err, con) => {
    if (err) {
        throw err;
    }
});

//user login returns token or error message
exports.login = (req, res) => {
    let username = req.body.username, password = req.body.password;

    dbUsers.query('SELECT * FROM dbuser WHERE username = ?', [username], (err, result) => {
        if (!err) {

            if (result.length < 1) {
                res.status(401).json({
                    message: "user not found",
                    status: "401"
                });
            }

            else {
                bcrypt.compare(password, result[0].password, (err, results) => {
                    if (err) {
                        throw err;
                    }
                    if (results) {
                        const token = jwt.sign({
                            username: result[0].username,
                            email: result[0].email,
                            api_key: result[0].api_key,
                        },
                            credentials.secret
                        );
                        dbUsers.query(`SELECT quota FROM dbuser WHERE username = ?`, [result[0].username], (err, res1) => {
                            fs.writeFileSync('C:/Users/andre/Desktop/softeng/back-end/config/limit.txt', res1[0].quota, 'utf-8');
                        })
                        return res.status(200).json({ token: token });
                    }
                    else {
                        res.status(401).json({
                            message: "password error",
                            status: "401"
                        });
                    }
                });
            }
        }
        else {
            throw err;
        }
    });
}

//user add, returs api_key or error message
exports.addUser = (req, res) => {
    let us = req.body;
    if (us.password.length < 5) return res.status(400).json({
        message: "Password needs to be longer than 5 characters",
        status: '400'
    });
    dbUsers.query('SELECT * FROM dbuser WHERE username = ? OR email = ?', [us.username, us.email], (err, result) => {
        if (!err) {
            if (result[0] != undefined) {
                return res.status(400).json({
                    message: "Username or e-mail already exist",
                    status: "400"
                });
            }
            else {
                bcrypt.hash(us.password, 12, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Something went wrong, try again",
                            status: "500"
                        });
                    }
                    else {
                        var key = new RandExp('[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}').gen()
                        var sql = "INSERT INTO `dbuser` (`username`, `password`, `email`, `api_key`, `quota`) VALUES (?, ?, ?, ?, ?)"
                        dbUsers.query(sql, [us.username, hash, us.email, key, us.quota], (err, rows, fields) => {
                            if (err) {
                                return res.status(500).json({
                                    message: "Couldn't create user",
                                    status: "500"
                                });
                            }
                            else res.status(200).json({
                                api_key: key
                            });
                        });
                    }
                });
            }
        }
        else throw err;
    });
}

//userupdate return updated values or error message
exports.updateUser = (req, res) => {
    let us = req.body;
    if (us.password.length < 5) return res.status(400).json({
        message: "Password needs to be longer than 5 characters",
        status: "400"
    });
    bcrypt.hash(us.password, 12, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: "Something went wrong, try again",
                status: "500"
            });
        }
        else {
            dbUsers.query('SELECT * FROM dbuser WHERE username = ?', [req.params.username], (err, result) => {
                if (!err) {
                    if (result.length < 1) res.status(403).json({
                        message: 'There is not a user with this username',
                        error: '403'
                    });
                    else {
                        dbUsers.query(
                            'UPDATE dbuser SET password = ?, email = ?, quota = ? WHERE username = ?',
                            [hash, us.email, us.quota, req.params.username],
                            (err, results) => {
                                if (!err) {
                                    res.status(200).json({
                                        username: result[0].username,
                                        email: us.email,
                                        api_key: result[0].api_key,
                                        quota: us.quota
                                    });
                                }
                                else {
                                    return res.status(500).json({
                                        message: "Couldn't create user",
                                        status: "500"
                                    });
                                }
                            });
                    }
                }
                else {
                    return res.status(500).json({
                        message: "Error finding user",
                        status: "500"
                    });
                }
            });
        }
    });
}

exports.addCSV = (req, res) => {
    //const format = req.query.format;
    const dataset = req.params.csvfile;
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        var startOfdatabase = parseInt(fs.readFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', 'utf-8'));
        let imports;
        let json = csvToJson.formatValueByType().fieldDelimiter(';').getJsonFromCsv(files.file.path);
        for (let i = 0; i < json.length; i++) {
            //console.log(1);
            if (dataset == 'ActualTotalLoad') {
                //console.log(2);
                dbEnergy.query(`SELECT * FROM actualtotalload WHERE Id = ?`, json[i].Id, (er, resp) => {
                    if (resp.length < 1) {
                        //console.log(3);
                        dbEnergy.query("INSERT INTO `actualtotalload`\
                            (`Id`, `EntityCreatedAt`, `EntityModifiedAt`, `ActionTaskID`, `Status`, `Year`, `Month`, `Day`, `DateTime`, `AreaName`, `UpdateTime`, `TotalLoadValue`, `AreaTypeCodeId`, `MapCodeId`, `AreaCodeId`, `ResolutionCodeId`, `RowHash`)\
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [json[i].Id, json[i].EntityCreatedAt.substr(0, 28), json[i].EntityModifiedAt.substr(0, 28),
                            json[i].ActionTaskID, json[i].Status, json[i].Year, json[i].Month, json[i].Day,
                            json[i].DateTime.substr(0, 28), json[i].AreaName, json[i].UpdateTime.substr(0, 28), json[i].TotalLoadValue,
                            json[i].AreaTypeCodeId, json[i].MapCodeId, json[i].AreaCodeId, json[i].ResolutionCodeId, json[i].RowHash],
                            (error, result) => {
                                if (error) throw error;
                                imports = parseInt(fs.readFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', 'utf-8'));
                                //console.log(imports);
                                imports = imports + 1;
                                fs.writeFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', imports, 'utf-8');
                            });
                    }
                });
            }
            else if (dataset == 'AggregatedGenerationPerType') {
                dbEnergy.query(`SELECT * FROM aggregatedgenerationpertype WHERE Id = ?`, json[i].Id, (er, resp) => {
                    if (resp.length < 1) {
                        dbEnergy.query("INSERT INTO `aggregatedgenerationpertype`\
                            (`Id`, `EntityCreatedAt`, `EntityModifiedAt`, `ActionTaskID`, `Status`, `Year`, `Month`, `Day`, `DateTime`, `AreaName`, `UpdateTime`, `ActualGenerationOutput`, `ActualConsuption`, `AreaTypeCodeId`, `AreaCodeId`, `ResolutionCodeId`, `MapCodeId`, `ProductionTypeId`, `RowHash`)\
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [json[i].Id, json[i].EntityCreatedAt.substr(0, 28), json[i].EntityModifiedAt.substr(0, 28),
                            json[i].ActionTaskID, json[i].Status, json[i].Year, json[i].Month, json[i].Day,
                            json[i].DateTime.substr(0, 28), json[i].AreaName, json[i].UpdateTime.substr(0, 28), json[i].ActualGenerationOutput,
                            json[i].ActualConsuption, json[i].AreaTypeCodeId, json[i].AreaCodeId, json[i].ResolutionCodeId, json[i].MapCodeId, json[i].ProductionTypeId, json[i].RowHash],
                            (error, result) => {
                                if (error) throw error;
                                imports = parseInt(fs.readFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', 'utf-8'));
                                //console.log(imports);
                                imports = imports + 1;
                                fs.writeFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', imports, 'utf-8');
                            });
                    }
                })
            }
            else {
                dbEnergy.query(`SELECT * FROM dayaheadtotalloadforecast WHERE Id = ?`, json[i].Id, (er, resp) => {
                    if (resp.length < 1) {
                        dbEnergy.query("INSERT INTO `dayaheadtotalloadforecast`\
                        (`Id`, `EntityCreatedAt`, `EntityModifiedAt`, `ActionTaskID`, `Status`, `Year`, `Month`, `Day`, `DateTime`, `AreaName`, `UpdateTime`, `TotalLoadValue`, `AreaTypeCodeId`, `AreaCodeId`, `ResolutionCodeId`, `MapCodeId`, `RowHash`)\
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [json[i].Id, json[i].EntityCreatedAt.substr(0, 28), json[i].EntityModifiedAt.substr(0, 28),
                            json[i].ActionTaskID, json[i].Status, json[i].Year, json[i].Month, json[i].Day,
                            json[i].DateTime.substr(0, 28), json[i].AreaName, json[i].UpdateTime.substr(0, 28), json[i].TotalLoadValue,
                            json[i].AreaTypeCodeId, json[i].AreaCodeId,
                            json[i].ResolutionCodeId, json[i].MapCodeId, json[i].RowHash],
                            (error, result) => {
                                if (error) {
                                    console.log(i);
                                    throw error
                                }
                            });
                        imports = parseInt(fs.readFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', 'utf-8'));
                        //console.log(imports);
                        imports = imports + 1;
                        fs.writeFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', imports, 'utf-8');
                    }
                })
            }
        }
        res.status(200).json({
            totalRecordInFIle: json.length,
            totalRecordsImported: json.length,
            totalRecordsInDatabase: json.length + startOfdatabase
        });
    });
}

//get user, return details or error
exports.getUser = (req, res) => {
    dbUsers.query('SELECT * FROM dbuser WHERE username = ?', [req.params.username], (err, result) => {
        if (!err) {
            if (result[0] === undefined) res.status(403).json({
                message: 'There is not a user with this username',
                status: '403'
            });
            else res.status(200).json({
                username: result[0].username,
                email: result[0].email,
                api_key: result[0].api_key,
                quota: result[0].quota
            });
        }
        else {
            throw err;
        }
    });
}

//logout return empty json or error
exports.logout = (req, res) => {
    const token = req.headers['x-observatory-auth'];
    const decode = jwt.verify(token, credentials.secret);
    let updateQuota = fs.readFileSync('C:\\Users\\andre\\Desktop\\softeng\\back-end\\config\\limit.txt', 'utf-8');
    fs.writeFileSync('C:\\Users\\andre\\Desktop\\softeng\\back-end\\config\\limit.txt', '', 'utf-8');
    console.log(updateQuota);
    dbUsers.query('UPDATE dbuser SET quota = ? WHERE username = ?', [updateQuota, decode.username], (err, result) => {
        if (!err) {
            res.status(200).json({});
        }
        else {
            throw err;
        }
    });
}