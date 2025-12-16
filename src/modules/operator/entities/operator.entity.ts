import { User } from "src/modules/user/entities/user.entity";
import { OperatorPosition } from "src/type/type";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('operators')
export class Operator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", nullable: true })
    name!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({
        type: 'enum',
        enumName: "operator_position",
        default: OperatorPosition.VIEWER,
        enum: OperatorPosition,
        nullable: true
    })
    position?: OperatorPosition;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;

    @OneToOne(() => User, user => user.operator, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}
