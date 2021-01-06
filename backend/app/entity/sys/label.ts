import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectID, ObjectIdColumn } from 'typeorm';


@Entity()
class Label {
    @ObjectIdColumn()
    id?: ObjectID;
    @Column({ unique: true })
    _id: string;
    @Column()
    name: string;
    @Column({ type: 'array', default: [] })
    aliases: string[];
    @Column({ type: 'timestamp' })
    addedOn: number
    @Column({ nullable: true })
    thumbnail: string | null;
    @Column({ nullable: true })
    color?: string | null;
}


export default Label;

