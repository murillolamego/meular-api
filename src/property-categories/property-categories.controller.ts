import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';

@Controller('property-categories')
export class PropertyCategoriesController {
  constructor(private readonly propertyCategoriesService: PropertyCategoriesService) {}

  @Post()
  create(@Body() createPropertyCategoryDto: CreatePropertyCategoryDto) {
    return this.propertyCategoriesService.create(createPropertyCategoryDto);
  }

  @Get()
  findAll() {
    return this.propertyCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto) {
    return this.propertyCategoriesService.update(+id, updatePropertyCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyCategoriesService.remove(+id);
  }
}
