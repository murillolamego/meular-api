import { PartialType } from '@nestjs/swagger';
import { CreatePropertyTypeDto } from './create-property-type.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePropertyTypeDto extends PartialType(CreatePropertyTypeDto) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}
