import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  parentCategoryId: number | null;
}
