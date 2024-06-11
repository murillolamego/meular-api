import { PartialType } from '@nestjs/swagger';
import { CreatePropertyCategoryDto } from './create-property-category.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePropertyCategoryDto extends PartialType(
  CreatePropertyCategoryDto,
) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}
