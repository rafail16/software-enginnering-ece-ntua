import { Injectable } from '@nestjs/common';
import {UserService} from "../Entities/user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {User} from "../Entities/user/entities/user.entity";
import {stringify} from "ts-jest/dist/utils/json";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService,
    ) {}

    async validate(username : string,password:string) : Promise<User | null> {
        const users = await this.userService.findAll();
        for (let x in users) {
           if (users[x].username===username) {
               console.log(password);
               const isMatch = await bcrypt.compare(password,users[x].password);
               console.log(isMatch);
               if (isMatch) {
                   let obj = {
                       status:"validated",
                       username:users[x].username,
                       id : users[x].id
                   }
                   return users[x];
                   //return JSON.stringify(obj);
               }
               else {
                   let obj = {
                       status:"Not Validated"
                   }
                   return null;
                   //return JSON.stringify(obj);
               }

           }
        }
    }

    login(user : User)  {
        const payload = {
            id : user.id,
            username : user.username
        }
        return {
            token: this.jwtService.sign(payload),
        }
    }

    async verify(token:string): Promise<User> {
        const decoded = this.jwtService.verify(token,{
            secret:'secret'
        })
        const user = this.userService.getUserByUsername(decoded.username);
        if (!user){
            throw new Error('Unable to get the user from decoded token');
        }
        return user;
    }
}
