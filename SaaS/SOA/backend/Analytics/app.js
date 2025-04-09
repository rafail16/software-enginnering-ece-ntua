const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
const redis = require('redis');
const indexRouter = require('./routes/index');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// REDIS
const REDIS_PORT = 6379;
const REDIS_HOST = "localhost";
const TotalConnections = 20;
const pool = require('redis-connection-pool')('myRedisPool',{
    host : REDIS_HOST,
    port : REDIS_PORT,
    max_clients : TotalConnections,
    perform_checks : false ,
    database : 0 ,
});
console.log("connected to redis");

pool.hget('proxy-subscribers','channel',async (err,data)=>{
    let currentSubscribers = JSON.parse(data);
    let alreadySubscribed = false ;
    let myAddress = 'http://localhost:4000';
    for (let i=0 ;i <currentSubscribers.length;i++){
        if (currentSubscribers[i]==myAddress){
            alreadySubscribed=true
        }
    }
    if (alreadySubscribed==false){
        currentSubscribers.push(myAddress);
        pool.hset('proxy-subscribers','channel',JSON.stringify(currentSubscribers),()=>{})
        console.log('subscribed');
    }
    else {
        console.log('already-subscribed');
    }
});

app.post('/bus',(req,res)=> {
    const event = req.body
    console.log(event)
    console.log("1000");
    res.send({status:'OK'})
});


module.exports = app;
