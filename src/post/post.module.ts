import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Category } from '../category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, Category])],
  controllers: [PostController],
  providers: [PostService, PostEntity],
  exports: [TypeOrmModule, PostEntity],
})
export class PostModule {}
