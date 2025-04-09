import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "../../question/entities/question.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    text : string;

    @Column( {type: 'date'})
    date_answered : string;

    @ManyToOne(() => Question, question => question.answers , {nullable:false ,onDelete: "CASCADE"} )
    @JoinColumn({name:'question_id'})
    question : Question;

    @ManyToOne(() => User, user => user.answers , {nullable:false ,onDelete: "CASCADE"} )
    @JoinColumn({name:'user_id'})
    user : User;

}
