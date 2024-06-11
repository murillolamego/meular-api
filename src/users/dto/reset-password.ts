import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { IsCUID } from '../../common/validators/cuid.validator';

export class ResetPasswordDto {
  @IsCUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  token: string;

  @IsStrongPassword()
  @MaxLength(50)
  password: string;
}
