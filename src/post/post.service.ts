import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';
import { saveFile } from '../utils';
import { DeleteResult } from 'typeorm';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private postRepository: PostRepository) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    try {
      const { location } = await saveFile(createPostDto.file);
      createPostDto.file = location;
      const post = await this.postRepository.createPost(createPostDto);
      this.logger.getTimestamp();
      this.logger.log(`Post is created with id: ${post.id}`);
      return post;
    } catch (e) {
      this.logger.getTimestamp();
      this.logger.error(e);
      throw new BadRequestException(e);
    }
  }

  async getPostById(id: number): Promise<PostEntity> {
    return this.postRepository.getPostById(id);
  }

  async deletePostById(id: number): Promise<DeleteResult> {
    return this.postRepository.deletePostById(id);
  }

  async getPosts(offset: number, category: string): Promise<PostEntity[]> {
    return this.postRepository.getPosts(offset, category);
  }

  async updatePost(createPostDto: CreatePostDto, id: number) {
    try {
      const { location } = await saveFile(createPostDto.file);
      createPostDto.file = location;
      const post = await this.postRepository.updatePost(createPostDto, id);
      this.logger.getTimestamp();
      this.logger.log(`Post is created with id: ${post.id}`);
      return post;
    } catch (e) {
      this.logger.getTimestamp();
      this.logger.error(e);
      throw new BadRequestException(e);
    }
  }
}
