

const express = require('express');
const createError = require('http-errors');
const router = express.Router();

//AUTHENTICATION modules
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret'; //Could be a private-public key pair
const bcrypt = require('bcrypt');
const  request = require('request');



passport.use('bcryptsignin',new LocalStrategy(function(username, password, cb) {

    //GET USER BY USERNAME
    if (!username) {
        console.log(username);
        return cb(null, false);
    }
    else {
        const requestOptions = {
            url: "http://localhost:3000/user",
            method: 'GET',
            json: {}
        }
        request(requestOptions, (err, response, bod) =>
        {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
               // for(var i = 0; i<bod.length;i++ ) {
                for (x in bod) {
                    //console.log(bod[x]);

                    if (bod[x].username === username) {

                        let identity = bod[x].id;
                        //res.json(body[x]);
                        bcrypt.compare(password, bod[x].password, function (err, res) {
                            if (err) return cb(err);
                            else if (res === false) {
                                console.log("in here");
                                return cb(null, {username: "NOT VALIDATED",id:"NOT VALIDATED"});
                            } else {

                                return cb(null, {username: username,id:identity});
                            }
                        });
                    }
                    else {
                        if (x == bod.length) return cb(null,false);
                    }
                }
            } else {
                console.log("in here");
                return cb(null, false);
            }
        });
    }
}));

passport.use('token', new JWTStrategy(
    {
     secretOrKey:JWT_SECRET,
     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token,done){
        return done(null, { username: token.username})
    },

));

//passport.authenticate('signin',{session: false}),
//passport.authenticate('bcryptsignin',{session:false}),
//POST signin
router.post('/signin', passport.authenticate('bcryptsignin',{session:false}),
    (req,res,next) => {
        if(req.user.username ==='NOT VALIDATED') res.json({
            status:"NOT VALIDATED"
        })
        else {
            //console.log(req);
            res.json({
                token : jwt.sign(req.user,JWT_SECRET,{expiresIn:3600})
            });
        }

    }
    /*function(req, res, next) {
      res.json({
        token : jwt.sign(req.user,JWT_SECRET,{expiresIn:3600})
      });
    }*/
);

//TEST ENDPOINT to check authentication
router.get('/authenticate', passport.authenticate('token',{session:false}),
    function(req,res,next){
        res.json({"status":"OK"});
    }
    /*function(req,res,next){
        res.json({user:req.user});
    }*/
);

router.post('/register', async function(req, res, next) {
    // Whatever verifications and checks you need to perform here
    bcrypt.genSalt(10, function(err, salt) {
        if (!req.body.password){
            res.json({'Error':'No Password Given'});
        }
        /*CHECK IF USER EXISTS*/
        //console.log(x)
        if (err) return next(err);
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            console.log(hash);
            if (err) return next(err);
            const username=req.body.username;
            const password=hash;
            if (!username || !password) {
                res.status(400).send("Error Inserting username or password");
            }
            else {
                let customobject = {};
                customobject.username=username;
                customobject.password=password;
                const requestOptions = {
                    url: "http://localhost:3000/user",
                    method: 'POST',
                    json: customobject
                }
                request(requestOptions, (err, response, body) =>
                {
                    if (err) {
                        console.log(err);
                    } else if (response.statusCode === 201) {
                        res.status(210).json({"Status":"OK"});
                        //res.json(body);  //Return object
                    } else {
                        res.status(400).send("An error was Encountered,check again");
                        console.log(response.statusCode);
                    }
                });
            }
            // Store the user to the database, then send the response
            // newUser.password = hash; // Or however suits your setup

        });
    });
});


/* UNIFY ALL ENDPOINTS OF BACKEND */

//Questions Per KW
router.get('/QuestionsPerKW',function (req, res, next) {
    if (!req.body.keyword && !req.body.id) {
        res.json({"error":"Not keyword given"});
    }
    else {
        const jsonObject=req.body;
        const requestOptions = {
            url: "http://localhost:4000/QuestionsPerKW",
            method: 'GET',
            json : jsonObject
        }
        request(requestOptions, (err, response, body) => {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
                res.json(body);
            } else {
                console.log(response.statusCode);
            }
        });
    }
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
router.get('/QuestionsPerDay',function (req, res, next) {
    if (!req.body.day && (!req.body.datefrom || !req.body.dateto)) {
        res.json({"error":"Bad Parameters in body"});
    }
    else {
        const jsonObject=req.body;
        const requestOptions = {
            url: "http://localhost:4000/QuestionsPerDay",
            method: 'GET',
            json : jsonObject
        }
        request(requestOptions, (err, response, body) => {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
                res.json(body);
            } else {
                console.log(response.statusCode);
            }
        });
    }
});


//Get answers of a question
//GET request at localhost:5000/answerOf + question in body ("question":id) as int
router.get('/AnswersOfQuestion',function(req,res,next) {
    if (!req.body.question) {
        res.json({"error": "Not keyword given"});
    }
    else {
        const jsonObject=req.body;
        const requestOptions = {
            url: "http://localhost:5000/AnswersOfQuestion",
            method: 'GET',
            json : jsonObject
        }
        request(requestOptions, (err, response, body) => {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
                res.json(body);
            } else {
                console.log(response.statusCode);
            }
        });

    }
});

//Get Answers per User
// endpoint localhost:5000/AnswerOfUser + user in body ("user":id) as int
router.get('/AnswersOfUser',function(req,res,next) {
    if (!req.body.user) {
        res.json({"error": "Not keyword given"});
    }
    else {
        const jsonObject=req.body;
        const requestOptions = {
            url: "http://localhost:5000/AnswersOfUser",
            method: 'GET',
            json : jsonObject
        }
        request(requestOptions, (err, response, body) => {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
                res.json(body);
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
router.post('/AddQuestion1',function(req,res,next){
    if (!req.body.user.id || !req.body.title || !req.body.text || !req.body.date_asked){
        res.json({"error":"No user given"});
    }
    else {
        const jsonObject=req.body;
        const requestOptions = {
            url: "http://localhost:5000/AddQuestion",
            method: 'POST',
            json : jsonObject
        }
        request(requestOptions, (err, response, body) => {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 201) {
                res.status(201).send({"status":"OK"});
            } else {
                res.send({"Status":"Error Occured inserting a Question"})
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
    if (!req.body.user.id || !req.body.text || !req.body.question.id || !req.body.date_answered){
        res.json({"error":"No user given"});
    }
    else {
        const jsonObject=req.body;
        const requestOptions = {
            url: "http://localhost:5000/AddAnswer",
            method: 'POST',
            json : jsonObject
        }
        request(requestOptions, (err, response, body) => {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 201) {
                res.status(201).send({"status":"OK"});
            } else {
                res.send({"Status":"Error Occured inserting an Answer"})
            }
        });
    }
});

module.exports = router;
