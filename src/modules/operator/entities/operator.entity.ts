import { OperatorPosition } from "src/type/type";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('operators')
export class Operator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", nullable: true })
    name!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @Column({
        type: 'enum',
        enumName: "operator_position",
        default: OperatorPosition.VIEWER,
        enum: OperatorPosition,
        nullable: true
    })
    position: OperatorPosition;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;
}
