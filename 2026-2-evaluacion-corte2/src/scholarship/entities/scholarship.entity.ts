import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scholarship {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "text",
        unique: true
    })
    name: string;

    @Column({
        type: "text",
        unique: true
    })
    code: string;

    @Column("int")
    percentage: number;

    @ManyToOne(
        () => User,
        { nullable: true }
    )
    createdBy?: User;
}
