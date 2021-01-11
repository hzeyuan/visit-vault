import { Entity,  Column, ObjectIdColumn } from 'typeorm';


@Entity()
class LabelledItem {
    @ObjectIdColumn()
    _id?: string;
    @Column()
    label: string;
    @Column()
    item: string;
    @Column()
    type: string;
}

export default LabelledItem;