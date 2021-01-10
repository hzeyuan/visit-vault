import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectID, ObjectIdColumn } from 'typeorm';


@Entity()
class Actor {
    @ObjectIdColumn({ type: "string", generated: true })
    id?: ObjectID;
    @Column()
    _id: string;
    @Column()
    name: string;
    @Column({ type: 'array', default: [] })
    aliases: string[];
    @Column({ type: 'timestamp' })
    addedOn: number
    @Column({ type: 'number', nullable: true })
    bornOn: number | null;
    @Column({ type: 'number', nullable: true })
    thumbnail: string | null
    @Column({ type: 'string', nullable: true })
    altThumbnail: string | null;
    @Column({ type: 'string', nullable: true })
    hero?: string | null;
    @Column({ nullable: true })
    avatar?: string
    @Column({ default: false })
    favorite: boolean;
    @Column({ type: 'string', nullable: true })
    bookmark: number | null;
    @Column({ default: 0 })
    rating: number
    @Column({ type: 'json' })
    customFields: Record<string, boolean | string | number | string[] | null> = {};
    @Column({ nullable: true })
    description?: string | null;
    @Column({ nullable: true })
    nationality?: string | null;
}


export default Actor;

