import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { PostEntity } from './post.entity';
import { saveFile } from '../utils';
import { DeleteResult, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async savePostValues(createTaskDto: CreatePostDto): Promise<PostEntity> {
    const post = new PostEntity();
    const { title, content, preview, file, author, category } = createTaskDto;

    const isCategoryExist = await this.categoryRepository.findOne({
      where: { id: category },
    });

    if (!isCategoryExist) {
      throw new ConflictException(`category: ${category} does not exist `);
    }

    post.title = title;
    post.content = content;
    post.preview = preview;
    post.thumbnail = file;
    post.author = author;
    post.category = category;

    await post.save();

    return post;
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    if (createPostDto.file) {
      const { location } = await saveFile(createPostDto.file);
      createPostDto.file = location;
    }

    const post = await this.savePostValues(createPostDto);

    if (!post) {
      const errorMessage = 'post was not created';
      this.logger.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    this.logger.log(`Post is created with id: ${post.id}`);

    return post;
  }

  async getPostById(id: number): Promise<PostEntity> {
    return await this.postRepository.findOneBy({ id });
  }

  async deletePostById(id: number): Promise<DeleteResult> {
    const result = await this.postRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return result;
  }

  async getPosts(offset: number, category: string): Promise<PostEntity[]> {
    const query: FindManyOptions = { skip: offset, take: 10 };
    if (category) {
      query.where = { category };
    }

    const posts = await this.postRepository.find(query);

    if (!posts) {
      throw new NotFoundException();
    }

    return posts;
  }

  async updatePost(createPostDto: CreatePostDto, id: number) {
    if (createPostDto.file) {
      const { location } = await saveFile(createPostDto.file);
      createPostDto.file = location;
    }

    const foundPost = await this.getPostById(id);

    if (!foundPost) {
      throw new NotFoundException();
    }

    const post = await this.savePostValues(createPostDto);
    this.logger.log(`Post is created with id: ${post.id}`);
    return post;
  }
}
