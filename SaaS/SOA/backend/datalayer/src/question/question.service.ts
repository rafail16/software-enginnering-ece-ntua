import {BadGatewayException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {Question} from "./entities/question.entity";

import {EntityManager} from "typeorm";
import {InjectEntityManager} from "@nestjs/typeorm";
import {User} from '../user/entities/user.entity';


@Injectable()
export class QuestionService {

  constructor( @InjectEntityManager() private manager : EntityManager) {}

  async create(createQuestionDto: CreateQuestionDto) : Promise<Question> {
    return this.manager.transaction( async manager => {
      const keywords = createQuestionDto.keyword;
      console.log(keywords);
      const userId = createQuestionDto.user.id;
      if (!userId) throw new BadGatewayException('User id is missing');
      const user = await manager.findOne(User, createQuestionDto.user.id);
      if (!user) throw new NotFoundException(`User ${userId} not found.`);
      const question = await manager.create(Question, createQuestionDto);
      question.user = user;
      question.keyword=keywords;
      return this.manager.save(question);
    });
  }

  async findAll() : Promise <Question[]> {
    return this.manager.find(Question,{relations:["keyword","user"]});
    //return `This action returns all question`;
  }

  async findOne(id: number) : Promise <Question>{
    const question = await this.manager.findOne(Question,id,{relations:["keyword"]});
    if (!question) throw new NotFoundException(`Question ${id} not found`);
    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) : Promise<Question> {
    return this.manager.transaction(async manager => {
      const question = await manager.findOne(Question,id);
      if (!question) throw new NotFoundException(`Question ${id} not found`);
      manager.merge(Question,question,updateQuestionDto);
      return manager.save(question);
    });
  }

  async remove(id: number) : Promise<void> {
    return this.manager.transaction(async manager => {
      const question = await manager.findOne(Question,id);
      if (!question) throw new NotFoundException(`Question ${id} not found`);
      await manager.delete(Question,id);
    });
  }
}
