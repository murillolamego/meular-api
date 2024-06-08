import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MaxLength(50)
  password: string;
}
