import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';

@ApiTags('property-types')
@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly propertyTypesService: PropertyTypesService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createPropertyTypeDto: CreatePropertyTypeDto) {
    return this.propertyTypesService.create(createPropertyTypeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.propertyTypesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.propertyTypesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePropertyTypeDto: UpdatePropertyTypeDto,
  ) {
    return this.propertyTypesService.update(+id, updatePropertyTypeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.propertyTypesService.remove(+id);
  }
}
