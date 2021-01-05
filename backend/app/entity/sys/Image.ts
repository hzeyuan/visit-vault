import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
class Image {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  _id: string;
  @Column()
  name: string;
  @Column()
  path: string;
  @Column()
  thumbPath: string;
  @Column({ type: 'text', nullable: true })
  scene: string | null;
  @Column({ type: 'date' })
  addedOn: number;
  @Column()
  favorite: boolean;
  @Column({ type: 'text', nullable: true })
  bookmark: number | null;
  @Column({ default: 0 })
  rating: number;
  @Column({ type: 'text' })
  customFields: Record<string, boolean | string | number | string[] | null> = {};
  @Column()
  meta: string;
  @Column({ type: 'text', nullable: true })
  actors: string | null;
  @Column({ type: 'text', nullable: true, default: '' })
  studio: string | null;
  @Column()
  hash: string;
  @Column({ type: 'text', nullable: true })
  color: string | null;
}


export default Image;

