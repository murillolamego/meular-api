import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { IsNanoId } from '../validators/nanoid.validator';

@Injectable()
export class parseNanoId implements PipeTransform<string, string> {
  transform(value: string): string {
    if (IsNanoId()) {
      return value;
    }

    throw new BadRequestException('Value must be a NanoId.');
  }
}
