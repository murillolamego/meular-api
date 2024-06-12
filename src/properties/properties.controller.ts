import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { parseNanoIdPipe } from '../common/pipes/nanoid.pipe';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req: any, @Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(req.user, createPropertyDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('user/:id')
  findAllByUserId(@Param('id', parseNanoIdPipe) userId: string) {
    return this.propertiesService.findAllByUserId(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id', parseNanoIdPipe) id: string) {
    return this.propertiesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id', parseNanoIdPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id', parseNanoIdPipe) id: string) {
    return this.propertiesService.remove(id);
  }
}
