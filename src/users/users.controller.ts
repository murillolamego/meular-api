import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { cuidPipe } from '../common/pipes/cuid.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The created record',
    type: UserEntity,
  })
  @ApiResponse({
    status: 503,
    description: 'The server could not process your request at this moment',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record(s)',
    isArray: true,
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing authentication credentials',
  })
  @ApiResponse({
    status: 503,
    description: 'The server could not process your request at this moment',
  })
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing authentication credentials',
  })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @ApiResponse({
    status: 503,
    description: 'The server could not process your request at this moment',
  })
  findOne(@Param('id', cuidPipe) id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The updated record',
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing authentication credentials',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not authorized for this operation',
  })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @ApiResponse({
    status: 503,
    description: 'The server could not process your request at this moment',
  })
  update(
    @Param('id', cuidPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The deleted record',
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing authentication credentials',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not authorized for this operation',
  })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @ApiResponse({
    status: 503,
    description: 'The server could not process your request at this moment',
  })
  remove(@Param('id', cuidPipe) id: string): Promise<UserEntity> {
    return this.usersService.remove(id);
  }
}
