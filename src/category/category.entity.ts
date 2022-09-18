import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentCategoryId: number;

  @Column({ unique: true })
  title: string;

  @Column({ default: '' })
  description: string;
}
