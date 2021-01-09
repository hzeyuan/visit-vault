import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectID, ObjectIdColumn } from 'typeorm';
import { generateHash } from '../../utils/hash';


@Entity()
class Label {
    // @ObjectIdColumn()
    // id?: ObjectID;
    @ObjectIdColumn()
    _id: string;
    @Column()
    name: string;
    @Column({ type: 'array', default: [] })
    aliases: string[];
    @Column({ type: 'timestamp' })
    addedOn: number
    @Column({ type: 'string', nullable: true })
    thumbnail: Image | null;
    @Column({ nullable: true })
    color?: string | null;
}




export default Label;

