const express = require('express');
const router = express.Router();
const  request = require('request');
const axios = require('axios');
const redis = require('redis');
//Get answers of a question
//GET request at localhost:5000/answerOf + question in body ("question":id) as int
router.get('/AnswersOfQuestion',function(req,res,next) {
  if (!req.body.question){
    res.json({"error":"Not keyword given"});
  }
  else{
    const requestOptions = {
      url: "http://localhost:3000/answer",
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
          if(body[x].question.id==req.body.question.id) {
            let customobj={};
            customobj.id=body[x].id;
            customobj.text=body[x].text;
            customobj.date_answered=body[x].date_answered;
            temp.push(customobj);
          }
        }
        res.json({answers:temp});  //Return object
      } else {
        console.log(response.statusCode);
      }
    });
  }
});

//Get Answers per User
// endpoint localhost:5000/AnswerOfUser + user in body ("keyword":id) as int
router.get('/AnswersOfUser',function(req,res,next) {
  if (!req.body.user){
    res.json({"error":"Not keyword given"});
  }
  else{
    const requestOptions = {
      url: "http://localhost:3000/answer",
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
          if(body[x].user.id==req.body.user) {
            let customobj={};
            customobj.id=body[x].id;
            customobj.text=body[x].text;
            customobj.date_answered=body[x].date_answered;
            temp.push(customobj);
          }
        }
        res.json({answers:temp});  //Return object
      } else {
        console.log(response.statusCode);
      }
    });
  }
});


//Get Questions per user
//Get localhost:5000/QuestionsPerUser + user in body ("user":id) as int
router.get('/QuestionsPerUser',function(req,res,next) {
  if (!req.body.user){
    res.json({"error":"No user given"});
  }
  else{
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
          if(body[x].user.id==req.body.user) {
            let customobj={};
            customobj.id=body[x].id;
            customobj.text=body[x].text;
            customobj.title=body[x].title;
            customobj.date_asked=body[x].date_asked;
            temp.push(customobj);
          }
        }
        res.json({questions:temp});  //Return object
      } else {
        console.log(response.statusCode);
      }
    });
  }
});



//Get Contributions per user per day
router.get('/QuestionsUserPerDay',function(req,res,next){
  if (!req.body.user || (!req.body.day && (!req.body.datefrom || !req.body.dateto))){
    res.json({"error":"Bad input data were given"});
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
    let questionsOfUser=[]

    //FIND QUESTIONS PER USER
    const requestOptions = {
      url: "http://localhost:3000/question",
      method: 'GET',
      json: {}
    }
    request(requestOptions, (err, response, body) => {
      if (err) {
        console.log(err);
      } else if (response.statusCode === 200) {
        //INIT RESULT ARRAY
        for (x in body) { //PARSE Question JSON
          //console.log(body[x]);
          if (body[x].user.id == req.body.user && body[x].date_asked >= datefrom && body[x].date_asked <= dateto) {
            let customobj = {};
            customobj.id = body[x].id;
            customobj.text = body[x].text;
            customobj.title = body[x].title;
            customobj.date_asked = body[x].date_asked;
            questionsOfUser.push(customobj);
          }
        }
        res.json({questions:questionsOfUser});

      }
      else {
        console.log(response.statusCode);
      }
    });

  }
});

router.get('/AnswersUserPerDay',function(req,res,next) {
  if (!req.body.user || (!req.body.day && (!req.body.datefrom || !req.body.dateto))) {
    res.json({"error": "Bad input data were given"});
  } else {
    let datefrom;
    let dateto;
    if (req.body.day) {
      datefrom = req.body.day;
      dateto = req.body.day;
    } else {
      datefrom = req.body.datefrom;
      dateto = req.body.dateto;
    }
    let answersOfUser = []

    //NOW FIND ANSWERS OF USER
    const requestOptions1 = {
      url: "http://localhost:3000/answer",
      method: 'GET',
      json: {}
    }
    request(requestOptions1, (err, response, body) => {
      if (err) {
        console.log(err);
      } else if (response.statusCode === 200) {
        //INIT RESULT ARRAY
        for (x in body) { //PARSE Question JSON
          //console.log(body[x]);
          if (body[x].user.id == req.body.user) {
            console.log()
            if (body[x].date_answered >= datefrom && body[x].date_answered <= dateto) {
              let customobj = {};
              customobj.id = body[x].id;
              customobj.text = body[x].text;
              customobj.questionId = body[x].question.id;
              customobj.questionTitle=body[x].question.title;
              customobj.date_answered = body[x].date_answered;
              answersOfUser.push(customobj);
            }
          }
        }
        res.json({answers:answersOfUser});
      } else {
        console.log(response.statusCode);
      }
    });
  }
});






//Post Question
/*
 Post localhost:5000/AddQuestion + body following the format
 {
    "text": "",
    "title":"",
    "user":{
      "id": "",
      ...
     },
     "date_asked":"",
     "keyword":[
      { "id": ""},
      { "id":""} ...
     ]
 }

 Text,title,user,date_asked are necessary ,keyword is optional
*/




//FETCH ALL ANSWERS
router.get('/GetQuestions',function(req,res,next){
  const requestOptions = {
    url: "http://localhost:3000/question",
    method: 'GET',
    json: {}
  }
  request(requestOptions, (err, response, body) => {
    if (err) {
      console.log(err);
    } else if (response.statusCode === 200) {
      //INIT RESULT ARRAY

      res.json({questions: body});
    } else {
      console.log(response.statusCode);
      res.json({status: "Datalayer Error"});
    }
  });
});


router.post('/AddQuestion',function(req,res,next){
  if (!req.body.user || !req.body.title || !req.body.text || !req.body.date_asked){
    console.log("IN HERE")
    res.json({"error":"No user given"});
  }
  else {
    console.log(req.body);
    //res.send("OK");
    let customobj = {};
    let user = {
      id : req.body.user
    }


    customobj.user = user
    customobj.title = req.body.title;
    customobj.text = req.body.text;
    customobj.date_asked = req.body.date_asked;
    let keywordList=[];
    if (req.body.keyword) {
      for (let i in req.body.keyword) {
        keywordList.push({id:parseInt(req.body.keyword[i].id)})
      }
    }
    console.log(keywordList);
    if (req.body.keyword) {
      customobj.keyword = keywordList;
      //customobj.keyword = req.body.keyword;
    }
    //Execute the data layer call now
    //res.send(customobj);
    const object = customobj;

    const requestOptions = {
        url: "http://localhost:3000/question",
        method: 'POST',
        json: object
    }
      //console.log(requestOptions);
      request(requestOptions, (err, response, body) =>
      {
        if (err) {
          res.statusCode(400).send(err);
          console.log(err);
        } else if (response.statusCode === 201) {
          res.send({"status":"OK"});
          console.log(response.statusCode);
        } else {
          res.send({"Status":"Error Occured inserting a Question"})
          console.log(response.statusCode);
        }
      });
    }
});


//Post Answer
/* Post localhost:5000/AddAnswer + body the format
  {
    "user":{
      "id":"",
      ...
    },
    "question":{
      "id":"",
      ...
    },
    "text":"",
    "date_answered":""
  }

  All Fields are mandatory
 */
router.post('/AddAnswer',function(req,res,next){
  if (!req.body.user || !req.body.text || !req.body.question.id || !req.body.date_answered){
    res.json({"error":"No user given"});
  }
  else {
    //res.send("OK");
    let customobj = {};
    let user = {
      id:req.body.user
    }
    customobj.user=user;
    customobj.question =req.body.question;
    customobj.text =req.body.text;
    customobj.date_answered =req.body.date_answered;
    const object = customobj;
    const requestOptions = {
      url: "http://localhost:3000/answer",
      method: 'POST',
      json: object
    }
    console.log(requestOptions);
    request(requestOptions, (err, response, body) =>
    {
      if (err) {
        console.log(err);
      } else if (response.statusCode === 201) {
        res.send({"status":"OK"});
        console.log(response.statusCode);
      } else {
        res.send({"Status":"Error Occured inserting an Answer"})
        console.log(response.statusCode);
      }
    });
  }
});

module.exports = router;
