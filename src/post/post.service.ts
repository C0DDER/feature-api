import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from './post.dto';
import { PostEntity } from './post.entity';
import { saveFile } from '../utils';
import { DeleteResult, FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  async savePostValues(
    createTaskDto: CreatePostDto,
  ): Promise<PostEntity> {
    const post = new PostEntity();
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

  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    try {
      const { location } = await saveFile(createPostDto.file);
      createPostDto.file = location;

      const post = await this.savePostValues(createPostDto);
      this.logger.log(`Post is created with id: ${post.id}`);
      return post;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
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
    const { location } = await saveFile(createPostDto.file);
    console.log(location);
    createPostDto.file = location;

    const foundPost = await this.getPostById(id);

    if (!foundPost) {
      throw new NotFoundException();
    }

    const post = await this.savePostValues(createPostDto);
    this.logger.log(`Post is created with id: ${post.id}`);
    return post;
  }
}
