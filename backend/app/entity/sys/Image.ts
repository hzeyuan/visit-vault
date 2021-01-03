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
  @Column({ nullable: true })
  scene: string;
  @Column()
  addedOn: Date;
  @Column()
  favorite: boolean;
  @Column({ nullable: true })
  bookmark: number;
  @Column({ default: 0 })
  rating: number;
  @Column()
  customFields: string;
  @Column()
  meta: string;
  @Column({ nullable: true })
  actors: string;
  @Column({ nullable: true, default: '' })
  studio: string;
  @Column()
  hash: string;
  @Column({ nullable: true })
  color: string;
}


export default Image;

