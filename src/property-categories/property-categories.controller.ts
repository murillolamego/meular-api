import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';

@ApiTags('property-categories')
@Controller('property-categories')
export class PropertyCategoriesController {
  constructor(
    private readonly propertyCategoriesService: PropertyCategoriesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createPropertyCategoryDto: CreatePropertyCategoryDto) {
    return this.propertyCategoriesService.create(createPropertyCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.propertyCategoriesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.propertyCategoriesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto,
  ) {
    return this.propertyCategoriesService.update(
      +id,
      updatePropertyCategoryDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.propertyCategoriesService.remove(+id);
  }
}
