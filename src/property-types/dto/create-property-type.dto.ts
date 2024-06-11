import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePropertyTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}
