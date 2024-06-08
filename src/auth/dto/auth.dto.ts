import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MaxLength(50)
  password: string;
}
