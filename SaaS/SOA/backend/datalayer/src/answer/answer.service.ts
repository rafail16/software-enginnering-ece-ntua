import {BadGatewayException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {Answer} from "./entities/answer.entity";
import {User} from "../user/entities/user.entity";
import {Question} from "../question/entities/question.entity";

@Injectable()
export class AnswerService {
  constructor( @InjectEntityManager() private manager : EntityManager) {}

  async create(createAnswerDto: CreateAnswerDto) : Promise <Answer>{
    return this.manager.transaction( async manager => {
      const qid = createAnswerDto.question.id;
      if (!qid) throw new BadGatewayException('Question id is missing');
      const question = await manager.findOne(Question, createAnswerDto.question.id);
      if (!question) throw new NotFoundException(`Question ${qid} not found.`);
      const userId = createAnswerDto.user.id;
      if (!userId) throw new BadGatewayException('User id is missing');
      const user = await manager.findOne(User, createAnswerDto.user.id);
      if (!user) throw new NotFoundException(`User ${userId} not found.`);

      const answer = await manager.create(Answer, createAnswerDto);
      answer.user = user;
      answer.question=question;
      return this.manager.save(answer);
    });
  }

  async findAll() : Promise <Answer[]> {
    return this.manager.find(Answer,{relations:["question","user"]});
  }

  async findOne(id: number) : Promise <Answer> {
    const answer = await this.manager.findOne(Answer,id);
    if (answer) throw new NotFoundException(`Answer ${id} not found`);
    return answer;
  }


  async update(id: number, updateAnswerDto: UpdateAnswerDto) : Promise <Answer> {
    return this.manager.transaction(async manager => {
      const answer = await manager.findOne(Answer,id);
      if (!answer) throw new NotFoundException(`Amswer ${id} not found`);
      manager.merge(Answer,answer,updateAnswerDto);
      return manager.save(answer);
    });
  }

  async remove(id: number) : Promise <void> {
    return this.manager.transaction(async manager => {
      const answer = await manager.findOne(Answer,id);
      if (!answer) throw new NotFoundException(`Answer ${id} not found`);
      await manager.delete(Answer,id);
    });
  }
}
