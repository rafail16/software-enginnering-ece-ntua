const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');

const cors = require('cors');
const app = express();
app.use(cors());

// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


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
  let myAddress = 'http://localhost:5000';
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
  res.render('error');
});

/*
app.listen(app.get('port'), () => {
      console.log(`Example app listening at http://localhost:${port}`)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
*/
module.exports = app;
