import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
class Actor {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    _id: string;
    @Column()
    name: string;
    @Column({ default: '' })
    aliases: string;
    @Column()
    addedOn: Date;
    @Column({ nullable: true })
    bornOn: number;
    @Column({ nullable: true })
    thumbnail: string
    @Column({ nullable: true })
    altThumbnail: string
    @Column({ nullable: true })
    hero?: string
    @Column({ nullable: true })
    avatar?: string
    @Column({ default: false })
    favorite: boolean;
    @Column({ nullable: true })
    bookmark: number
    @Column({ default: 0 })
    rating: number
    @Column()
    customFields: string;
    @Column({ nullable: true })
    description?: string
    @Column({ nullable: true })
    nationality?: string
}


export default Actor;

