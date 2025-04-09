import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Render, Request, Res} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {User} from "../Entities/user/entities/user.entity";
import {UserService} from "../Entities/user/user.service";
import {HttpService} from "@nestjs/axios";
import {map} from "rxjs/operators";
import {ExtractJwt} from "passport-jwt";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService : UserService,
        private httpService: HttpService) {}



    //Protected endpoint ,returns a json token
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async login( @Req() req,@Res() res)  {
        for (let i in req.cookies) {
            res.clearCookie(i);
        }
        const result =this.authService.login(req.user as User);
        res.setHeader('Authorization','Bearer '+result.token);
        res.cookie('loggedIn','true');
        res.cookie('password',req.user.password);
        res.cookie('userId',req.user.id);
        res.redirect('/api/landing_page');
    }

    @Post('signup')
    async signup(@Req() req,@Res() res) {
        const saltOrRounds = 10;
        if (!req.body.password || !req.body.username || ! req.body.password2){
            return { message : "No password Given or Username Given"};
        }
        else if (req.body.password !== req.body.password2) {
            return { message : "Passwords need to match"};
        }
        else {
            const hash = await bcrypt.hash(req.body.password, saltOrRounds);
            let customobj={
                username:req.body.username,
                password:hash
            }
            const params = JSON.stringify(customobj);
            console.log(customobj,req.body.password);
            const x = await this.httpService.post('http://localhost:3000/user',
                params,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .toPromise()
                .then( result =>  {
                    res.redirect('/api/landing_page');
                    return {"message":"Ok"};
                })
                .catch(err => {
                    console.log("Error Occured");
                    return {"message" :"Error ,maybe try a different username"}
                });

            console.log(x);
            return x;

        }
    }

}
