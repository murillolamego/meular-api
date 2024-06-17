import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { IsNanoId } from '../../common/validators/nanoid.validator';

export class ResetPasswordDto {
  @IsNanoId()
  publicId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  token: string;

  @IsStrongPassword()
  @MaxLength(50)
  password: string;
}
