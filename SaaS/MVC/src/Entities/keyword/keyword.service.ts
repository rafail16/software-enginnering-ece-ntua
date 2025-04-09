import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {Keyword} from "./entities/keyword.entity";

@Injectable()
export class KeywordService {

  constructor(@InjectEntityManager() private manager : EntityManager){}

  async create(createKeywordDto: CreateKeywordDto) : Promise <Keyword> {
    const keyword = await this.manager.create(Keyword, createKeywordDto);
    return this.manager.save(keyword);
  }

  async findAll(): Promise <Keyword[]> {
    return this.manager.find(Keyword);
  }

  async findOne(id: number): Promise <Keyword> {
    const keyword = await this.manager.findOne(Keyword,id);
    if (!keyword) throw new NotFoundException(`User ${id} not found`);
    return keyword;
  }

  async update(id: number, updateKeywordDto: UpdateKeywordDto) : Promise <Keyword> {
    return this.manager.transaction( async manager =>
    {
      const keyword=await manager.findOne(Keyword,id);
      if (!keyword) throw new NotFoundException(`Keyword ${id} not found`);
      manager.merge(Keyword,keyword,updateKeywordDto);
      return manager.save(keyword);
    });
  }

  async remove(id: number) : Promise <void> {
    return this.manager.transaction( async manager => {
      const keyword=await manager.findOne(Keyword,id);
      if (!keyword) throw new NotFoundException(`Keyword ${id} not found`);
      await manager.delete(Keyword,id);
    });
  }
}
