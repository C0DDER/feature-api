import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostEntity } from './post.entity';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    file.filename = new Date().getTime().toString();
    createPostDto.file = file;
    return this.postService.createPost(createPostDto);
  }

  @Delete('/:id')
  removePostById(@Param('id') id: number) {
    return this.postService.deletePostById(id);
  }

  @Get('/:id')
  getPostById(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Get('/list/:category/:offset')
  getPosts(
    @Param('offset') offset: number,
    @Param('category') category: string,
  ): Promise<PostEntity[]> {
    return this.postService.getPosts(offset, category);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  updatePost(
    @Param('id') id: number,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      file.filename = new Date().getTime().toString();
      createPostDto.file = file;
    }
    return this.postService.updatePost(createPostDto, id);
  }
}
