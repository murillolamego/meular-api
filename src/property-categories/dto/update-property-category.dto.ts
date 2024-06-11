import { PartialType } from '@nestjs/swagger';
import { CreatePropertyCategoryDto } from './create-property-category.dto';

export class UpdatePropertyCategoryDto extends PartialType(CreatePropertyCategoryDto) {}
