import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class IDimensions {
    @Column({ type: 'number', nullable: true })
    width: number | null;
    @Column({ type: 'number', nullable: true })
    height: number | null;
}

@Entity()
class SceneMeta {
    @Column({ type: 'number', nullable: true })
    size: number | null;
    @Column({ type: 'number', nullable: true })
    duration: number | null;
    @Column(type => IDimensions)
    dimensions: IDimensions | null;
    @Column({ type: 'number', nullable: true })
    fps: number | null;
}

@Entity()
class Scene {
    @ObjectIdColumn({ type: "string", generated: true })
    _id: string;
    @Column({ type: 'string', nullable: true })
    hash: string | null
    @Column()
    name: string;
    @Column({ type: 'string', nullable: true })
    description: string | null;
    @Column({ type: 'timestamp' })
    addedOn: number;
    @Column({ type: 'number', nullable: true })
    releaseDate: number | null;
    @Column({ type: 'string', nullable: true })
    thumbnail: string | null;
    @Column({ type: 'string', nullable: true })
    preview: string | null;
    @Column({ default: false })
    favorite: boolean;
    @Column({ type: 'number', nullable: true })
    bookmark: number | null;
    @Column({ default: 0 })
    rating: number;
    @Column({ type: 'json' })
    customFields: Record<string, boolean | string | number | string[] | null> = {};
    @Column({ type: 'string', nullable: true })
    path: string | null;
    @Column({ type: 'array', default: [] })
    streamLinks: string[];
    @Column({ type: 'array' })
    watches?: number[]; // backwards compatibility, array of timestamps of watches
    @Column(type => SceneMeta)
    meta: SceneMeta
    @Column({ type: 'string', nullable: true })
    studio: string | null;
    @Column({ default: false })
    processed: boolean
}


export default Scene;

