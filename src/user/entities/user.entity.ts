import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole{
    OPERATOR='operator',
    USER='user',
    DRIVER='driver'
}
@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column()
    name!:string;

    @Column({type:'enum',default:UserRole.USER})
    role!:string;

    @Column({type:'text',nullable:true})
    position!:string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;

}
