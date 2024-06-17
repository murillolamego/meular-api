import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsNanoId } from '../../common/validators/nanoid.validator';

export class ValidateEmailDto {
  @IsNanoId()
  publicId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  token: string;
}
