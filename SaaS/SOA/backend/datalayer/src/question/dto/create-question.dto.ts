import {Keyword} from "../../keyword/entities/keyword.entity";

export class CreateQuestionDto {
    readonly text: string;
    readonly title : string;
    readonly date_asked : string;
    readonly user : { id : number} ;
    readonly keyword : Keyword[] ;
}
