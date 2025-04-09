//require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require('mysql');
const morgan = require('morgan');
const bodyPasrer = require('body-parser');
const fs = require('fs');
const baseUrl = '/energy/api';
const credentials = require('./back-end/config/credentials')
const controlUser = require('./back-end/controllers/users');
const userRoutes = require('./back-end/routes/users');
const actualTotal = require('./back-end/routes/ActualTotalLoad');
const actVSfor = require('./back-end/routes/ActualvsForecast');
const aggregated = require ('./back-end/routes/AggregatedGenerationPerType');
const dayAhead = require('./back-end/routes/DayAheadTotalLoadForeacast');
const cors = require('cors');

//inform terminal for changes
app.use(morgan('dev'));
//allow app to connect
app.use(cors());
//allow encoded files as well as json objects
app.use(bodyPasrer.urlencoded({limit: Infinity, extended: true}));
app.use(bodyPasrer.json({limit: Infinity}));

var dbUsers = mysql.createConnection({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbusers',
    multipleStatements: true   
});  

var dbEnergy = mysql.createConnection({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbenergy',
    multipleStatements: true   
}); 

var counter = 0;
dbUsers.connect((err, con) => {
    if (err) {
        throw err;
    }
    counter += 1;
});
dbEnergy.connect((err, con) => {
    if (err) {
        throw err;
    }
    counter += 1;
});

//admin endpoints
app.use(`${baseUrl}/Admin`, userRoutes);
//all user endpoints
app.post(`${baseUrl}/Login`, controlUser.login);
app.post(`${baseUrl}/Logout`, controlUser.logout);
//search endpoints
app.use(`${baseUrl}/ActualTotalLoad`, actualTotal);
app.use(`${baseUrl}/AggregatedGenerationPerType`, aggregated);
app.use(`${baseUrl}/DayAheadTotalLoadForecast`, dayAhead);
app.use(`${baseUrl}/ActualvsForecast`, actVSfor);
//helping endpoints
app.get(`${baseUrl}/HealthCheck`, (req, res) => {
    if (counter == 2) res.status(200).json({
        status: 'OK'
    });
    else {
        res.status(400).json({
            status: "400",
            message: "Database not ok"
        });
    }
});

app.post(`${baseUrl}/Reset`, (req, res) => {
    dbUsers.query("DELETE FROM dbuser WHERE (username) NOT IN ('admin')", (err, result) => {
        if(err) throw err;
    });
    dbEnergy.query("DELETE FROM actualTotalLoad", (err, result) => {
        if (err) throw err;
    });
    dbEnergy.query("DELETE FROM aggregatedgenerationpertype", (err, result) => {
        if (err) throw err;
    });
    dbEnergy.query("DELETE FROM dayaheadtotalloadforecast", (err, result) => {
        if (err) throw err;    
    });
    fs.writeFileSync('C:/Users/andre/Desktop/softeng/back-end/config/totalRecordsImported.txt', 0, 'utf-8');
    res.status(200).json({
        status: 'OK'
    });
});

//no route was able to handle the request
app.use((req, res, next) => {
    const error = new Error('Bad request');
    error.status = 400;
    next(error);
});
//handling the errors
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

module.exports = app;