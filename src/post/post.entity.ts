import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  preview: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  category: string;

  @Column()
  thumbnail: string;
}
