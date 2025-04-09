import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "../../question/entities/question.entity";
import {Answer} from "../../answer/entities/answer.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false,unique:true})
    username:string;

    @Column({nullable:false})
    password:string;

    @OneToMany(type => Question ,question => question.user)
    questions: Question[];

    @OneToMany(type => Answer ,answer => answer.user)
    answers: Answer[];


}

