import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectID, ObjectIdColumn } from 'typeorm';
import { generateHash } from '../../utils/hash';


@Entity()
class LabelledItem {
    @ObjectIdColumn()
    id?: ObjectID;
    @Column({ default:`li_${generateHash()}`,unique: true })
    _id?: string;
    @Column()
    label: string;
    @Column()
    item: string;
    @Column()
    type: string;
}

export default LabelledItem;