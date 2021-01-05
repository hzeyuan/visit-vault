import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
class Label {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    _id: string;
    @Column()
    name: string;
    @Column()
    aliases: string;
    @Column()
    addedOn: Date
    @Column({ nullable: true })
    thumbnail: string;
    @Column({ nullable: true })
    color?: string;
}


export default Label;

