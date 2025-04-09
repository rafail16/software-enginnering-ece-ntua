import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Keyword {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    keyword:string;
}
