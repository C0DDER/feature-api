import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from './category.dto';
import { PostEntity } from '../post/post.entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createCategory({
    description,
    parentCategoryId,
    title,
  }: CategoryDto): Promise<Category> {
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { title },
    });

    if (isCategoryExist) {
      throw new ConflictException('category already exist');
    }

    const category = await this.categoryRepository.save({
      title,
      description,
      parentCategoryId,
    });

    this.logger.log(
      `category with id: ${category.id} and title: ${category.title} was created`,
    );

    return category;
  }

  async deleteCategory(id: number): Promise<{ isDeleted: boolean }> {
    const deleteResult = await this.categoryRepository.delete({ id });

    if (!deleteResult.affected) {
      throw new NotFoundException(`category with id: ${id} was not found`);
    }

    this.logger.log(`set null category to all posts with categories id: ${id}`);

    const affectedPosts = await this.postRepository.update(
      { category: id },
      { category: null },
    );

    this.logger.log(
      `updating categories finished, affected rows: ${affectedPosts.affected}`,
    );

    return {
      isDeleted: true,
    };
  }

  async updateCategoryById(
    id: number,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.categoryRepository.update(id, categoryDto);

      this.logger.log(
        `category with id: ${category.raw.id} and title: ${category.raw.title} was updated`,
      );

      return category.raw;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
