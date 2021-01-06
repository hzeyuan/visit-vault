import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class ImageDimensions {
  @Column({ type: 'number', nullable: true })
  width: number | null;
  @Column({ type: 'number', nullable: true })
  height: number | null;
}

@Entity()
class ImageMeta {
  @Column({ type: 'number', nullable: true })
  size: number | null;
  @Column(type => ImageDimensions)
  dimensions: ImageDimensions;
}

@Entity()
class Image {
  @ObjectIdColumn()
  id?: ObjectID;
  @Column({ unique: true })
  _id: string;
  @Column()
  name: string;
  @Column({ type: 'text', nullable: true })
  path: string | null;
  @Column({ type: 'text', nullable: true })
  thumbPath: string | null;
  @Column({ type: 'text', nullable: true })
  scene: string | null;
  @Column({ type: 'timestamp' })
  addedOn: number;
  @Column()
  favorite: boolean;
  @Column({ type: 'text', nullable: true })
  bookmark: number | null;
  @Column({ default: 0 })
  rating: number;
  @Column({ type: 'json' })
  customFields: Record<string, boolean | string | number | string[] | null> = {};
  @Column(type => ImageMeta)
  meta: ImageMeta;
  @Column({ type: 'array', nullable: true })
  actors?: string[] | undefined;
  @Column({ type: 'text', nullable: true, default: '' })
  studio: string | null;
  @Column({ type: 'string' })
  hash: string | null;
  @Column({ type: 'text', nullable: true })
  color: string | null;
}



export default Image;

