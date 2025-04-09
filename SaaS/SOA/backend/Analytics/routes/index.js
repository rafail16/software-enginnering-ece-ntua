const express = require('express');
const router = express.Router();
const  request = require('request');
const axios = require('axios');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*QUESTIONS PER KEYWORD*/
router.get('/QuestionsPerKW',function (req, res, next) {
  /*Metadata for authentication */
  let metadata = req.body;
  let response ;
  delete metadata.endpoint;
  delete metadata.method;
  metadata = Object.assign({
    endpoint : "authenticate",
    method : "get"
  },metadata);
  const test =  axios({
    method : "post",
    url : 'http://localhost:3001/bus',
    data : metadata,
    headers : req.headers
  }).then(resp=>{
    console.log(resp);
    // AUTHORIZATION SUCCEED
    console.log(resp["data"]);
    if(true) {
    //if (resp["data"]["status"]=='OK') {
      if (!req.body.keyword && !req.body.id) {
        res.json({"error":"Not keyword given"});
      }
      else {
        const requestOptions = {
          url: "http://localhost:3000/question",
          method: 'GET',
          json: {}
        }
        request(requestOptions, (err, response, body) =>
        {
          if (err) {
            console.log(err);
          } else if (response.statusCode === 200) {
            let temp=[]; //INIT RESULT ARRAY
            for(x in body) { //PARSE Question JSON
              if (body[x].keyword.length>0) { //GET KEYWORD ARRAY OBJECT
                for (kw in body[x].keyword) { //Parse Keyword array of question
                  if(req.body.keyword) {
                    if(body[x].keyword[kw].keyword == req.body.keyword){
                      temp.push(body[x]);
                    }
                  }
                  else if(req.body.id){
                    if(body[x].keyword[kw].id == req.body.id){
                      temp.push(body[x]);
                    }
                  }
                }
              }
            }
            res.json(temp);  //Return object
          } else {
            console.log(response.statusCode);
          }
        });
      }
    }
    // AUTHORIZATION FAILED
    else {
      res.json({"status":"Error"})
    }
  }).catch(e=>{
    res.json({"status":"Error"})
    console.log("error");
  });

  //console.log(response);

  //axios.post
  /*if (!req.body.keyword && !req.body.id) {
    res.json({"error":"Not keyword given"});
  }
  else {
    const requestOptions = {
      url: "http://localhost:3000/question",
      method: 'GET',
      json: {}
    }
    request(requestOptions, (err, response, body) =>
    {
      if (err) {
        console.log(err);
      } else if (response.statusCode === 200) {
        let temp=[]; //INIT RESULT ARRAY
        for(x in body) { //PARSE Question JSON
          if (body[x].keyword.length>0) { //GET KEYWORD ARRAY OBJECT
            for (kw in body[x].keyword) { //Parse Keyword array of question
              if(req.body.keyword) {
                if(body[x].keyword[kw].keyword == req.body.keyword){
                  temp.push(body[x]);
                }
              }
              else if(req.body.id){
                if(body[x].keyword[kw].id == req.body.id){
                  temp.push(body[x]);
                }
              }
            }
          }
        }
        res.json(temp);  //Return object
      } else {
        console.log(response.statusCode);
      }
    });
  } */
});


/*QUESTIONS PER DAY
 INPUT 1 day or From Date , To Date
 Input :
        {
          day : "2020-06-01"
        }

       or

        {
          {datefrom :""},
          {dateto:""}
        }
 */
router.get('/QuestionsPerDay',function(req,res,next) {
  if (!req.body.day && (!req.body.datefrom || !req.body.dateto)) {
    res.json({"error":"Bad Parameters in body"});
  }
  else {
    let datefrom;
    let dateto ;
    if (req.body.day) {
      datefrom=req.body.day;
      dateto=req.body.day;
    }
    else {
       datefrom=req.body.datefrom;
       dateto=req.body.dateto;
    }
    const requestOptions = {
      url: "http://localhost:3000/question",
      method: 'GET',
      json: {}
    }
    request(requestOptions, (err, response, body) =>
    {
      if (err) {
        console.log(err);
      } else if (response.statusCode === 200) {
        let temp=[]; //INIT RESULT ARRAY
        for(x in body) { //PARSE Question JSON
          console.log(body[x]);
          if (body[x].date_asked >= datefrom && body[x].date_asked <= dateto) {
            let customobj={};
            customobj.id=body[x].id;
            customobj.text=body[x].text;
            customobj.title=body[x].title;
            customobj.date_asked=body[x].date_asked;
            temp.push(customobj);
          }
        }
        res.json(temp);  //Return object
      } else {
        console.log(response.statusCode);
      }
    });
  }
});
module.exports = router;
