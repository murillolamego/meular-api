import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { isCuid } from '@paralleldrive/cuid2';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsCUIDConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return isCuid(id);
  }
}

export function IsCUID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCUIDConstraint,
    });
  };
}
