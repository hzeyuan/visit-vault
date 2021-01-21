import { Entity, Column, ObjectIdColumn } from 'typeorm';



@Entity()
class ActorReference {
    @ObjectIdColumn({ type: "string", generated: true })
    _id: string;
    @Column()
    item: string;
    @Column()
    actor: string;
    @Column()
    type: string;

}
export default ActorReference;