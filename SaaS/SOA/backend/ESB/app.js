const createError = require('http-errors');
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

app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json())
app.use('/', indexRouter);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

/*
pool.hset('bus','messages',JSON.stringify([]),()=>{});
pool.hset('subscribers','channel',JSON.stringify([]),()=>{});
pool.hset('proxy','messages',JSON.stringify([]),()=>{});
pool.hset('proxy-subscribers','channel',JSON.stringify([]),()=>{});
*/




//USED AS PROXY
app.post('/proxy',async(req,res)=> {
  const event = req.body;
  let currentMessages ;
  let newMessage = {};
  //console.log(req.body);
  pool.hget('proxy','messages',async(err,data)=>{
    currentMessages = JSON.parse(data);
    newMessage = {
      "id":currentMessages.length+1,
      method : event.method ,
      endpoint : event.endpoint ,
      event,
      "timestamp": Date.now()
    }
    currentMessages.push(newMessage);
    pool.hset('proxy','messages',JSON.stringify(currentMessages), () => {
      pool.hget('proxy-subscribers','channel',  (err,data) => {
        let subscribers = JSON.parse(data);
        for (let i =0 ; i <subscribers.length ;i++){
          console.log(subscribers[i]);
          axios({
            method : newMessage.method,
            url : subscribers[i]+"/"+newMessage.endpoint,
            data : event ,
            headers : req.headers
          }).then(resp=>{
            //console.log(resp)
            console.log("IN HERE")
            console.log(subscribers[i]+"/"+newMessage.endpoint,resp["data"])
            res.json(resp["data"]);
          }).catch( e=>{
            //console.log(e);
            //console.log(e);
            //res.send(resp);
            console.log(subscribers[i],{"status":"lost connection"})
          });
        }
      });
    });
  });
});



//SERVICE discovery
app.get('/bus',async(req,res)=> {
  //FIND ABOUT Provided services
  //Service 1 Authenticator
  const AuthenticatorService = {
    Name : "Authenticator",
    Services : [{
      Endpoint : "signin",
      Method : "Post",
      params : ["username" , "password" ],
      response : "Bearer Token"
      },
      {
      Endpoint : "register",
      Method : "Post",
      params : ["username","password"],
      response : "Status Code"
     }
     ]
  }
  const QAManagerService = {
    Name : "QAManager Service",
    Services : [ {
      Endpoint : "answerOf",
      Method : "Get",
      params : ["question object (at least id required)"],
      response : "Answers of  questions"
      },
      {
      Endpoint : "AnswerOfUser",
      Method : "Get",
      params : ["user object (at least id required)"],
      response : "Answers of a user"
      },
      {
      Endpoint : "QuestionsPerUser",
      Method : "Get",
      params : ["user object (at least id required)"],
      response : "Questions of a user"
      },
      {
      Endpoint : "AddQuestion",
      Method : "Post",
      params : {
        "text": "",
        "title":"",
        "user":{
          "id": ""
        },
        "date_asked":"",
        "keyword":[
          { "id": ""},
          { "id":""}
        ]
      },
      response : "Add A Question"
      },
     {
      Endpoint : "AddAnswer",
      Method : "Post",
      params : {
        user :{
          id:""
        },
        question:{
          id:"",
        },
        text:"",
        date_answered:""
      },
      response : "Add an Answer"
    }]
  }
  const AnalyticsService = {
    Name : "Analytics",
    Services : [{
      Endpoint : "QuestionsPerKW",
      Method : "Get",
      params : ["keyword object", "id"],
      response : "Questions Per a particular keyword"
    },
    {
      Endpoint : "QuestionsPerDay",
      Method : "Get",
      params : [{
        day : "2020-06-01"
      },{
        datefrom :"",
        dateto:""
      }],
      response : "Get all Questions per Day"
    }]
  }
  customObject = {
    AuthenticatorService : AuthenticatorService,
    QAManagerService : QAManagerService,
    AnalyticsService : AnalyticsService
  }
  res.send(customObject);
});


//Service Bus mainly used for Authenticator
app.post('/bus',async(req,res)=> {
  const event = req.body;
  let currentMessages ;
  let newMessage = {};
  pool.hget('bus','messages',async(err,data)=>{
    currentMessages = JSON.parse(data);
    newMessage = {
      "id":currentMessages.length+1,
      method : event.method ,
      endpoint : event.endpoint ,
      event,
      "timestamp": Date.now()
    }
    let statusOut = {"status":"Error"}
    console.log(event)
    currentMessages.push(newMessage);
    pool.hset('bus','messages',JSON.stringify(currentMessages), () => {
      pool.hget('subscribers','channel',  (err,data) => {
        let subscribers = JSON.parse(data);
        for (let i =0 ; i <subscribers.length ;i++){
          console.log(subscribers[i]);
          axios({
            method : newMessage.method,
            url : subscribers[i]+"/"+newMessage.endpoint,
            data : event ,
            headers : req.headers
          }).then(resp=>{
            console.log(resp);
            //res.send(resp);
            //console.log(resp);
            console.log(subscribers[i]+"/"+newMessage.endpoint,resp["data"])
            console.log("IN HERE")
            statusOut = {"status":"OK"}
            //res.send(resp["data"]);
            res.send(statusOut);
            //res.send({"status":"OK"});

          }).catch(e=>{
            //DISABLE AUTHORIZATION
            //res.send({"status":"Authorization Failed"});
            res.send({"status":"OK"});
            console.log(subscribers[i],{"status":"lost connection"})
          });
        }
        //res.send(statusOut);
      });
    });
  });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("OK");
  //res.render('error');
});

module.exports = app;
