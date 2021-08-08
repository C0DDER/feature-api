import { NotFoundException } from '@nestjs/common';
import {
  DeleteResult,
  EntityRepository,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { CreatePostDto } from './post.dto';
import { PostEntity } from './post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async savePostValues(
    post: PostEntity,
    createTaskDto: CreatePostDto,
  ): Promise<PostEntity> {
    const { title, content, preview, file, author, category } = createTaskDto;

    post.title = title;
    post.content = content;
    post.preview = preview;
    post.thumbnail = file;
    post.author = author;
    post.category = category;

    await post.save();

    return post;
  }

  async createPost(createTaskDto: CreatePostDto): Promise<PostEntity> {
    const post = new PostEntity();

    return await this.savePostValues(post, createTaskDto);
  }

  async deletePostById(id: number): Promise<DeleteResult> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return result;
  }

  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async updatePost(createPostDto: CreatePostDto, id: number) {
    const post = await this.getPostById(id);

    return await this.savePostValues(post, createPostDto);
  }

  async getPosts(offset: number, category: string): Promise<PostEntity[]> {
    const query: FindManyOptions = { skip: offset, take: 10 };
    if (category) {
      query.where = { category };
    }
    const posts = await this.find(query);

    if (!posts) {
      throw new NotFoundException();
    }

    return posts;
  }
}
