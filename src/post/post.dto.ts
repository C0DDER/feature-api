import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  preview: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  category: string;

  file?: any;
}
