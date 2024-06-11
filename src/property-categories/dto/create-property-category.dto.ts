import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePropertyCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}
