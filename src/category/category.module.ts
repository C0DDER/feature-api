import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { PostEntity } from '../post/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, PostEntity])],
  providers: [CategoryService, Category],
  controllers: [CategoryController],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
