import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Keyword} from "../../keyword/entities/keyword.entity";
import {Answer} from "../../answer/entities/answer.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    title : string;

    @Column()
    text : string;

    @Column( {type: 'date'})
    date_asked : string;

    @ManyToOne(() => User, user => user.questions , {nullable:false ,onDelete: "CASCADE"} )
    @JoinColumn({name:'user_id'})
    user : User;

    @ManyToMany(() => Keyword)
    @JoinTable()
    keyword: Keyword[];

    @OneToMany(type => Answer ,answer => answer.question)
    answers: Answer[];

}
