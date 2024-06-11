import { Injectable } from '@nestjs/common';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';

@Injectable()
export class PropertyCategoriesService {
  create(createPropertyCategoryDto: CreatePropertyCategoryDto) {
    return 'This action adds a new propertyCategory';
  }

  findAll() {
    return `This action returns all propertyCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} propertyCategory`;
  }

  update(id: number, updatePropertyCategoryDto: UpdatePropertyCategoryDto) {
    return `This action updates a #${id} propertyCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyCategory`;
  }
}
