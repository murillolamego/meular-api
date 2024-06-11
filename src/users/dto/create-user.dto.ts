import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;
}
