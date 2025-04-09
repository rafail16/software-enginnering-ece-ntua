const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport=require('passport');
const indexRouter = require('./routes/index');
const bodyParser=require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
const db = require('./pgqueries');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'pug');


app.use(
    bodyParser.urlencoded({
      extended:true
    })
)
app.use(passport.initialize());
app.use('/', indexRouter);

/* DataLayer User functionality*/
app.get('/users',db.getUsers);
app.get('/UserByUsername',db.getUserByUsername);
app.post('/newUser',db.createUser);
//app.put('/userupdate',db.updateUser);

/*app.delete('/userdelete/:username',db.deleteUser);*/

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
  let myAddress = 'http://localhost:8000';
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


pool.hget('subscribers','channel',async (err,data)=>{
  let currentSubscribers = JSON.parse(data);
  //let alreadySubscribed = true ;
  let alreadySubscribed = false ;
  let myAddress = 'http://localhost:8000';
  for (let i=0 ;i <currentSubscribers.length;i++){
    if (currentSubscribers[i]==myAddress){
      alreadySubscribed=true
    }
  }
  if (alreadySubscribed==false){
    currentSubscribers.push(myAddress);
    pool.hset('subscribers','channel',JSON.stringify(currentSubscribers),()=>{})
    console.log('subscribed');
  }
  else {
    console.log('already-subscribed');
  }
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//logger manually
app.use(function(err,req,res,next){
  const status = err.status || 500;
  if (status >=500 || req.app.get('env') === 'development') {
    console.error(err.stack);
  }
  next(err);
})


// error handler
app.use(function(err, req, res, next) {
  const status=err.status || 500;
  res.status(status);
  const message = status >= 500 ? "Something's wrong" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.end(expose ? message+'\n\n'+err.stack :message);
});

module.exports = app;
