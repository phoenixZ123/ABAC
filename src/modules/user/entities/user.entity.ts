import { UserRole } from "src/type/type";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        enumName: "user_role", 
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({ type: 'text', nullable: true })
    position!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;

}
