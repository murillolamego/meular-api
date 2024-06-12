import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  title: string;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  types: number[];

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  categories: number[];
}
