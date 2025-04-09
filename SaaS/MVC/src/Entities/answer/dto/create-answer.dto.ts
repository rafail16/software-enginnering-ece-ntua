import {Keyword} from "../../keyword/entities/keyword.entity";

export class CreateAnswerDto {
    readonly text: string;
    readonly date_answered : string;
    readonly user : { id : number} ;
    readonly question : { id : number};
}
