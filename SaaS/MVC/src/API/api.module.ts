import { Module } from '@nestjs/common';

import { APIController} from "./api.controller";

import {QuestionService} from "../Entities/question/question.service";
import {UserService} from "../Entities/user/user.service";
import {AnswerService} from "../Entities/answer/answer.service";
import { KeywordService } from 'src/Entities/keyword/keyword.service';


// @ts-ignore
@Module({
    imports:[],
    //imports : [TypeOrmModule.forFeature([User])],
    controllers: [APIController],
    providers: [KeywordService,AnswerService,QuestionService,UserService]
})
export class ApiModule {}