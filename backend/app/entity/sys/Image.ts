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
  @Column()
  scene: string;
  @Column()
  addedOn: Date;
  @Column()
  favorite: boolean;
  @Column()
  bookmark: number;
  @Column()
  rating: number;
  @Column()
  customFields: string;
  @Column()
  meta: string;
  @Column()
  actors: string;
  @Column()
  studio: string;
  @Column()
  hash: string;
  @Column()
  color: string;
}


export default Image;

