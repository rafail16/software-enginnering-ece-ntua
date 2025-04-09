import { Injectable } from '@nestjs/common';
import {KeywordService} from "./Entities/keyword/keyword.service";

@Injectable()
export class AppService {



  getHello(): string {
    return 'Hello World!';
  }
}
