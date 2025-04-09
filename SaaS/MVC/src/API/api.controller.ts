import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Render, Res} from '@nestjs/common';
import {request} from "express";
import {AppService} from "../app.service";
import {KeywordService} from "../Entities/keyword/keyword.service";
import {UserService} from "../Entities/user/user.service";
import {AnswerService} from "../Entities/answer/answer.service";
import {Keyword} from "../Entities/keyword/entities/keyword.entity";
import { Request } from 'express';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {QuestionService} from "../Entities/question/question.service";
import {type} from "os";
/*Here I have to create the endpoints*/

@Controller('api')
export class APIController {
    constructor(private readonly keywordService : KeywordService,
                private readonly userService : UserService,
                private readonly answerService : AnswerService,
                private readonly questionService : QuestionService) {}
    //constructor(private readonly userService: UserService) {}

    // USEFUL


    @Get('QuestionsPerKW')
    @Render('questions_keywords')
    async QuestionsPerKWtest(@Res() res) {
        let questions = await this.questionService.findAll();
        let dict = new Object();
        for (let x in questions) {
            if (questions[x].keyword.length>0){
                for (let kw in questions[x].keyword) {
                    console.log((questions[x].keyword[kw].keyword));
                    if (dict[questions[x].keyword[kw].keyword]) {
                        dict[(questions[x].keyword[kw].keyword)]+=1
                    }
                    else dict[(questions[x].keyword[kw].keyword)] =1
                }
            }
        }
        const lab =[];
        Object.keys(dict).forEach(key => lab.push(String(key.replace("'",'"'))));
        return {
            pie: {
                labels: JSON.stringify(lab),
                values: Object.values(dict)
            },
            dict: dict
        }
        //return {"keywords":Object.keys(dict),"values":Object.values(dict)};
    }

    @Get('QuestionsPerPeriod')
    @Render('questions_period')
    async QuestionsPerPeriod(@Res() res) {
        let questions = await this.questionService.findAll();
        console.log(questions);
        let today = new Date();
        let last3days = new Date(Date.now()-3*24*3600*1000);
        let last7days = new Date(Date.now()-7*24*3600*1000);
        let lastMonth = new Date(Date.now()-31*24*3600*1000);
        let lastMonthQs=[];
        let last3Qs=[];
        let last7Qs=[];
        questions.forEach(question => {
            const dateCreated = new Date(question.date_asked);

            //console.log(dateCreated);
            //console.log(last7days);
            //console.log(lastMonth);
            console.log(+dateCreated);
            console.log(+last7days);
            console.log("*****");
            if (+dateCreated <= +today && +dateCreated >= +last7days) {
                console.log("In here");
                last7Qs.push(question);
            }
            if(+dateCreated <= +today && +dateCreated >= +last3days) {
                last3Qs.push(question);
            }
            if(+dateCreated <= +today && +dateCreated >= +lastMonth) {
                lastMonthQs.push(question);
            }
        });
        console.log({
            questionsM : lastMonthQs,
            questionsW : last7Qs

        })
        return({
            questionsM : lastMonthQs,
            questionsW : last7Qs
        });
    }

    @Get('AnswerQuestion')
    @Render('question_to_answer')
    async questionToAnswer(@Req() req,@Res() res) {
        let questions = await this.questionService.findAll();
        return {questions:questions};
    }


    @Get('login')
    @Render('login')
    async login(@Req() req,@Res() res) {
        //cookies = req.cookies;
        for (let i in req.cookies) {
            res.clearCookie(i);
        }
        return {status:"OK"};
    }

    @Get('AskQuestion')
    @Render('ask_question')
    async askQuestion() {
        let keywordsList = await this.keywordService.findAll();
        console.log("ASK QUESTION LOG")
        console.log(keywordsList);
        return {keywords : keywordsList};
        //let questions = await this.questionService.findAll();
    }

    @Post('/submitQuestion')
    async submitQuestion(@Req() req,@Res() res) {
        console.log("SUBMIT QUESTION LOG")
        console.log(req.cookies);
        if (req.cookies.loggedIn) {
            let user= {
                id:req.cookies.userId
            }
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            //console.log(date);
            //console.log(req.body.keywords);
            let keyList=[]
            for (let i in req.body.keywords) {
                keyList.push({"id":parseInt(req.body.keywords[i])});
            }
            console.log(keyList);
            let customObj = {
                user:user,
                title :req.body.title,
                text :req.body.text,
                date_asked :date,
                keyword:keyList
            }
            console.log(customObj);
            const object = customObj;
            let x = await this.questionService.create(object)
                .then(result=> {
                    console.log(result);
                    res.cookie('message','Successful Insertion');
                    res.redirect('success');
                })
                .catch(err => {
                    console.log(err.message);
                    //res.redirect('landing_page');
                    res.redirect('AskQuestion');
                    //return {"message" :err.message};
                });

            //res.redirect('landing_page');
        }
        else {
            res.redirect('login');
        }
        //Extract
    }


    @Get('/success')
    @Render('successful')
    success(@Req() req){
        return {message:req.cookies.message};
    }

    @Get('logout')
    @Render('landing_page')
    logout(@Req() req,@Res() res) {
        for (let i in req.cookies) {
            res.clearCookie(i);
        }
    }

    @Get('myPage')
    @Render('my_page')
    myPage(@Req() req,@Res() res) {
        return {status:"OK"};
    }

    @Get('signup')
    @Render('signup')
    signup(@Req() req,@Res() res) {
        for (let i in req.cookies) {
            res.clearCookie(i);
        }
        return {status:"OK"};
    }

    @Get('/landing_page')
    @Render('landing_page')
    login1(@Req() req) {
        console.log(req.cookies);
        return {status:"200"};
    }

    @Get('myContributions')
    @Render('myContrib')
    async myContributions(@Req() req , @Res() res) {
        if (req.cookies.loggedIn) {
            req.body.user=req.cookies.userId;
            let result= await this.answersOfUser(req);
            //let questions = await this.questionsPerUser(req);
            let answers = result.answers;
            let questions = result.questions;
            return {
                answers:answers,
                questions:questions
            }
        }
        else {
            res.redirect('login')
            //return({status:"OK"});
            //alert("Something went wrong");
            //res.redirect('landing_page');
        }
    }


    //@Get('/MyContribution')
    async answersOfUser(@Req() req:Request){
        let answers = await this.answerService.findAll();
        if (!req.body.user) {
            return {"error":"No user was given"};
        }
        let temp=[]
        for (let x in answers) {
            if(answers[x].user.id==req.body.user) {
                let customobj={
                    id:answers[x].id,
                    text:answers[x].text,
                    date_answered:answers[x].date_answered
                };
                temp.push(customobj);
            }
        }
        let questions = await this.questionService.findAll();
        let temp2=[]
        for (let x in questions) {
            if(questions[x].user.id==req.body.user) {
                let customobj={
                    id:questions[x].id,
                    text:questions[x].text,
                    title:questions[x].title,
                    date_asked:questions[x].date_asked

                };
                temp2.push(customobj);
            }
        }
        return {"answers":temp, "questions": temp2};
    }


    @Post('QuestionToAnswer')
    @Render('answer_question')
    async AnswerQuestion(@Req() req, @Res() res) {
        res.clearCookie('questionId');
        let id = parseInt(req.body.question);
        let question = await this.questionService.findOne(id);
        console.log(question);
        let tempKeywords=[]
        for (let i in question.keyword) {
            tempKeywords.push(question.keyword[i].keyword);
        }
        console.log(tempKeywords);
        //NOW GET ANSWERS OF QUESTION
        req.body.question=question.id;
        let x = await this.answersOfQuestions(req);
        console.log(x);
        res.cookie('questionId',question.id);
        return {
            keywords:tempKeywords,
            answers:x
        };
    }


    @Post('/AddAnswerOfQuestion')
    async addAnswerOfQuestion(@Req() req, @Res() res) {
        let questionId = parseInt(req.cookies.questionId);
        if (req.cookies.loggedIn) {
            let user= {
                id:req.cookies.userId
            }
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let customObj = {
                user:user,
                text :req.body.text,
                date_answered :date,
                question:{
                    id:questionId
                }
            }
            console.log(customObj);
            const object = customObj;
            let x = await this.answerService.create(object)
                .then(result=> {
                    console.log(result);
                    res.cookie('message','Successful Insertion');
                    res.clearCookie('questionId');
                    res.redirect('landing_page');
                })
                .catch(err => {
                    console.log(err.message);
                    //res.redirect('landing_page');
                    res.clearCookie('questionId');
                    res.redirect('landing_page');
                });
        }
        else {
            res.redirect('login');
            //res.redirect('login');
        }
    }







    //USELESS




    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() request:Request): Promise<Keyword[]> {
        console.log(request);
        return this.keywordService.findAll();
    }


    @Get('/QuestionsPerDay')
    //@UseGuards(JwtAuthGuard)
    async questionsPerDay(@Req() req: Request) {
        let questions = await this.questionService.findAll();
        if (!req.body.day && (!req.body.datefrom || !req.body.dateto)) {
            return {"error":"Bad Parameters in body"};
        }
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
        let temp=[];
        for(let x in questions) { //PARSE Question JSON
            console.log(questions[x].date_asked)
            if (questions[x].date_asked >= datefrom && questions[x].date_asked <= dateto) {
                console.log(questions[x].date_asked,datefrom,dateto)
                let customobj={
                    id : questions[x].id,
                    text : questions[x].text,
                    title : questions[x].title,
                    date_asked : questions[x].date_asked
                };
                temp.push(customobj);
            }
        }
        return {"result":temp};
    }

    @Get('/AnswersOfQuestion')
    //@UseGuards(JwtAuthGuard)
    async answersOfQuestions(@Req() req:Request) {
        let answers = await this.answerService.findAll();
        if (!req.body.question) {
            return {"error":"No questions was given"};
        }
        let temp=[]
        for (let x in answers) {
            if(answers[x].question.id==req.body.question) {
                let customobj={
                    id:answers[x].id,
                    text:answers[x].text,
                    date_answered:answers[x].date_answered
                };
                temp.push(customobj);
            }
        }
        return {"result":temp};
    }


    @Get('/QuestionsOfUser')
    //@UseGuards(JwtAuthGuard)
    async questionsPerUser(@Req() req:Request){
        let questions = await this.questionService.findAll();
        if (!req.body.user) {
            return {"error":"No user was given"};
        }
        let temp=[]
        for (let x in questions) {
            if(questions[x].user.id==req.body.user) {
                let customobj={
                    id:questions[x].id,
                    text:questions[x].text,
                    title:questions[x].title,
                    date_asked:questions[x].date_asked

                };
                temp.push(customobj);
            }
        }
        return {"result":temp};
    }


    @Post('/AddQuestion')
    //@UseGuards(JwtAuthGuard)
    async addQuestion(@Req() req:Request) {
        if (!req.body.user.id || !req.body.title || !req.body.text || !req.body.date_asked){
            return {"error":"Not all question parameters were provided"};
        }
        let customObj = {
            user:req.body.user,
            title :req.body.title,
            text :req.body.text,
            date_asked :req.body.date_asked,
            keyword:[]
        }
        if (req.body.keyword) {
            customObj.keyword = req.body.keyword;
        }
        const object = customObj;
        let x = this.questionService.create(object)
                .then(res=> {
                    console.log(res);
                    return {"Status":"Ok"};
                })
                .catch(err => {
                    console.log("Error Occured");
                    return {"message" :err.message};
                });
        return {"result":x};
    }


    @Post('/AddAnswer')
    //@UseGuards(JwtAuthGuard)
    async addAnswer(@Req() req:Request) {
        if (!req.body.user.id || !req.body.question.id || !req.body.text || !req.body.date_answered){
            return {"error":"Not all Answer parameters were provided"};
        }
        let customObj = {
            user:req.body.user,
            question :req.body.question,
            text :req.body.text,
            date_answered :req.body.date_answered
        }
        const object = customObj
        const x = await this.answerService.create(object)
            .then(res=> {
                console.log(res);
                return {"Status":"Ok"};
            })
            .catch(err => {
                console.log("Error Occured");
                return {"message" :err.message}
            });
        return {"result":x};
        //redirect to 
    }


}
