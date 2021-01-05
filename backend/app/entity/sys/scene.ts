import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
class Scene {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    _id: string;
    @Column({ nullable: true })
    hash: string
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @Column()
    addedOn: Date;
    @Column({ nullable: true })
    releaseDate: number;
    @Column({ nullable: true })
    thumbnail: string;
    @Column({ nullable: true })
    preview: string;
    @Column({ default: false })
    favorite: boolean;
    @Column({ nullable: true })
    bookmark: number;
    @Column({ default: 0 })
    rating: number;
    @Column({ nullable: true })
    customFields: string;
    @Column({ nullable: true })
    path: string;
    @Column({ nullable: true })
    // streamLinks: string[] = [];
    // @Column({ nullable: true })
    // watches?: number[]; // backwards compatibility, array of timestamps of watches
    // @Column({ nullable: true })
    // meta = new SceneMeta();
    @Column({ nullable: true })
    studio: string;
    @Column({ default: false })
    processed: boolean
}


export default Scene;

