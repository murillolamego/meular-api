import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isCuid } from '@paralleldrive/cuid2';

@Injectable()
export class parseCUID implements PipeTransform<string, string> {
  transform(value: string): string {
    if (isCuid(value)) {
      return value;
    }

    throw new BadRequestException('Value must be a CUID.');
  }
}
