import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  title: string;
}
