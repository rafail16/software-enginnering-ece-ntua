import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './Entities/question/question.module';
import { UserModule } from './Entities/user/user.module';
import { AnswerModule } from './Entities/answer/answer.module';
import { KeywordModule } from './Entities/keyword/keyword.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {config} from './orm.config'
import {UserService} from "./Entities/user/user.service";
import {KeywordService} from "./Entities/keyword/keyword.service";
import {QuestionService} from "./Entities/question/question.service";
import {AnswerService} from "./Entities/answer/answer.service";
import {ApiModule} from "./API/api.module";
import { AuthModule } from './auth/auth.module';
import {AuthController} from "./auth/auth.controller";
import {AuthService} from "./auth/auth.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {APIController} from "./API/api.controller";

@Module({
  imports: [ApiModule,QuestionModule, UserModule, AnswerModule, KeywordModule,TypeOrmModule.forRoot(config), AuthModule],
  controllers: [AppController],
  providers: [AppService,UserService,QuestionService,KeywordService,AnswerService],
})
export class AppModule {}
